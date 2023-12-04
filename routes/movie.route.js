import express from "express"

import {createMovie, updateMovie, deleteMovie, getMovie, getAllMovies, getRandomMovie} from "../controllers/movie.controller.js"

import { verifyToken } from './../middlewares/jwt.js';

const router = express.Router()

router.post("/", verifyToken, createMovie)
router.put("/:id", verifyToken, updateMovie)
router.delete("/:id", verifyToken, deleteMovie)
router.get("/find/:id", verifyToken, getMovie)
router.get("/", verifyToken, getAllMovies)
router.get("/random", verifyToken, getRandomMovie)



export default router