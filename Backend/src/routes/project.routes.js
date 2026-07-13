import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjectById,
  updateMemberRole,
  getProjects,
  deleteProject,
  updateProject,
  getProjectsMember,
} from "../controllers/project.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembersToProject,
} from "../validates/validate.midd.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailabeUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);
router
  .route("/:projectId")
  .get(validateProjectPermission(AvailabeUserRole), getProjectById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    deleteProject,
  );

router
.route("/:projectId/members")
.get(getProjectsMember)
.post(validateProjectPermission([UserRolesEnum.ADMIN]),addMembersToProject,validate,addMembersToProject)

router
.route("/:projectId/members/:userId")
.put(validateProjectPermission(UserRolesEnum.ADMIN),updateMemberRole)
.post(validateProjectPermission([UserRolesEnum.ADMIN]),addMembersToProject,validate,addMembersToProject)
.delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteMember)

export default router;
