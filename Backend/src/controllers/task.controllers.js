import User from "../models/student.model.js";
import Project from "../models/project.modals.js";
import { Task } from "../models/taskmodel.js";
import { Subtask } from "../models/subtask.models.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose, { sanitizeFilter } from "mongoose";
import { AvailabeUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError("404", "Project Not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(),
  }).populate("assignedTo", "avatar username fullName");

  return res.status(201).json(new ApiResponse(201, task, "Task Fetched"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError("404", "Project Not found");
  }

  const files = req.files || [];

  const attachments = files.map((files) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Successfully"));
});
const getTasksbyId = asyncHandler(async (req, res) => {
  const { taskId } = eq.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks1",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        createdBy: {
          $arryElemAt: ["$createdBy", 0],
        },
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arryElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, task[0], "Task fetched Successfully"));
});
const updateTask = asyncHandler(async (req, res) => {
  //chai
});
const deleteTask = asyncHandler(async (req, res) => {
  //chai
});
const createSubTask = asyncHandler(async (req, res) => {
  //chai
});
const updateSubTask = asyncHandler(async (req, res) => {
  //chai
});

export {
  getTasks,
  createTask,
  getTasksbyId,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
};
