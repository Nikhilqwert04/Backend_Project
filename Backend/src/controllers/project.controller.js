import User from "../models/student.model.js";
import Project from "../models/project.modals.js";
import ProjectMember from "../models/projectmember.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
  //test
});

const getProjectById = asyncHandler(async (req, res) => {
  //test
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  return res
    .res(201)
    .json(new ApiResponse(201, project, "Project Created Successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project Updated Succesfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project Deleted Succesfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  //test
});

const getProjectsMember = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate(
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projects",
        foreignField: "_Id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_Id",
              foreignField: "projects",
              as: "projectmembers",
            },
          },
          {
            $addfield: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
          {
            $unwind: "$project",
          },
          {
            $project: {
              project: {
                _id: 1,
                description: 1,
                members: 1,
                createdAt: 1,
                createdBy: 1,
              },
              role: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Project fetched successfully"));
});

const updateMemberproject = asyncHandler(async (req, res) => {
  //test
});

const deleteMember = asyncHandler(async (req, res) => {
  //test
});

export {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjectById,
  updateMemberproject,
  getProjects,
  deleteProject,
  updateProject,
  getProjectsMember,
};
