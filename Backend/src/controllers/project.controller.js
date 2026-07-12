import User from "../models/student.model.js";
import Project from "../models/project.modals.js";
import  {ProjectMember} from "../models/projectmember.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailabeUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
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
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
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

const getProjectById = asyncHandler(async (req, res) => {
  const { projectID } = req.params;
  const project = await Project.findById(projectID);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .res(200)
    .json(new ApiResponse(201, project, "Project Fetched Successfully"));
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
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not Exist");
  }

  await projectMember.findByIdAndUpdate(
    {
      user: mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project Memeber Added Succesfully"));
});

const getProjectsMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(req.params);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMembers = await projectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
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
    {
      $addFields: {
        user: {
          $arryElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        projectMembers,
        "Project Member Fetched Succesfully",
      ),
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;

  if (!AvailabeUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  let projectMember = await projectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project Memeber note found");
  }

  projectMember = await projectMember.findByIdAndUpdate(
    projectMember._id,
    { role: newRole },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(400, "Project Memeber note found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        projectMembers,
        "Project Member role updated Successfully",
      ),
    );
});

const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

  let projectMember = await projectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project Memeber note found");
  }

  projectMember = await projectMember.findByIdAndDelete(
    projectMember._id,
  );

  if (!projectMember) {
    throw new ApiError(400, "Project Memeber note found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        projectMembers,
        "Project Member Deleted Successfully Successfully",
      ),
    );
});

export {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjectById,
  updateMemberRole,
  getProjects,
  deleteProject,
  updateProject,
  getProjectsMember,
};
