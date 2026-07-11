import User from "../models/student.model.js";
import Project from "../models/project.modals.js";
import ProjectMember from "../models/projectmember.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import  Mongoose  from "mongoose";
import mongoose from "mongoose";


const getProjects = asyncHandler(async(req,res)=>{
    //test
})

const getProjectById = asyncHandler(async(req,res)=>{
    //test
})

const createProject = asyncHandler(async(req,res)=>{
    const {name,description} = req.body
    const project= await Project.create({
        name,description,
        createdBy:new mongoose.Types.ObjectId(req.user._id)
    })

    await ProjectMember.create(
        {user: new mongoose.Types.ObjectId(req,user._id),
        project: new mongoose.Types.ObjectId()
        }
    )
})

const updateProject = asyncHandler(async(req,res)=>{
    //test
})

const deleteProject = asyncHandler(async(req,res)=>{
    //test
})

const addMembersToProject = asyncHandler(async(req,res)=>{
    //test
})

const getProjectsMember = asyncHandler(async(req,res)=>{
    //test
})

const updateMemberproject = asyncHandler(async(req,res)=>{
    //test
})

const deleteMember = asyncHandler(async(req,res)=>{
    //test
})

export{
    addMembersToProject,
    createProject,
    deleteMember,
    getProjectById,
    updateMemberproject,
    getProjects,
    deleteProject,
    updateProject,
    getProjectsMember
}