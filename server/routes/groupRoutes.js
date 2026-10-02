import express from "express";

import {
  createGroup,
  getMyGroups,
  addMember,
  removeMember,
} from "../controllers/groupController.js";

import { protectRoute } from "../middleware/auth.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);

groupRouter.get("/", protectRoute, getMyGroups);

groupRouter.post("/:groupId/add", protectRoute, addMember);

groupRouter.delete("/:groupId/remove", protectRoute, removeMember);

export default groupRouter;