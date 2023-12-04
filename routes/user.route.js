import express from "express"

import {updateUser, deleteUser, getUser, getAllUsers, getUserStats} from "../controllers/user.controller.js"

import { verifyToken } from './../middlewares/jwt.js';

const router = express.Router()

router.put("/:id", verifyToken, updateUser)
router.delete("/:id", verifyToken, deleteUser)
router.get("/find/:id", verifyToken, getUser)
router.get("/", verifyToken, getAllUsers)
router.get("/stats", verifyToken, getUserStats)



export default router