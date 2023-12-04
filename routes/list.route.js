import express from "express"

import {createList, updateList, deleteList, getList, getAllLists, getRandomList} from "../controllers/list.controller.js"

import { verifyToken } from './../middlewares/jwt.js';

const router = express.Router()

router.post("/", verifyToken, createList)
router.put("/:id", verifyToken, updateList)
router.delete("/:id", verifyToken, deleteList)
router.get("/", verifyToken, getList)
router.get("/find/:id", verifyToken, getAllLists)
router.get("/random", verifyToken, getRandomList)



export default router