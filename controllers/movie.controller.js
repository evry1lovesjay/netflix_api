import Movie from "../models/Movie.model.js"
import createError from "../utils/createError.js";

//CREATE
export const createMovie = async (req, res, next) => {
    if(req.cookieAdmin){
        const newMovie = new Movie(req.body)
        try {
            const savedMovie = await newMovie.save() 
            res.status(200).json(savedMovie)
        } catch (error) {
           res.status(500).json(error)
        }
    } else{
        next(createError(403, "You are not allowed to add a new movie!"))
    } 
}

//UPDATE
export const updateMovie = async (req, res, next) => {
    if(req.cookieAdmin){
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
                {$set: req.body}, {new: true})
            res.status(200).json(updatedMovie)
        } catch (error) {
           res.status(500).json(error)
        }
    } else{
        next(createError(403, "You are not allowed to update any movie!"))
    } 
}

//DELETE
export const deleteMovie = async (req, res, next) => {
    if(req.cookieAdmin){
        try{
            await Movie.findByIdAndDelete(req.params.id)
            res.status(200).send("The Movie has been deleted!")
        } catch (error) {
            next(error)
        }
    } else{
        return next(createError(401, "You are not authorized"))
    }
}


//GET
export const getMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id)
        res.status(200).send(movie)
    } catch (error) {
        next(error)
    }
}

//GET RANDOM
export const getRandomMovie = async (req, res, next) => {
    const type = req.query.type
    let movie
    try {
        if(type === "series"){
            movie = await Movie.aggregate([
                { $match: {isSeries: true} },
                { $sample: {size: 1} },
            ])
        } else {
            movie = await Movie.aggregate([
                { $match: {isSeries: false} },
                { $sample: {size: 1} },
            ])
        }
        res.status(200).send(movie)
    } catch (error) {
        next(error)
    }
}

//GET ALL
export const getAllMovies = async (req, res, next) => {
    const query = req.query.new;
    if(req.cookieAdmin){

        try {
            const movies = query ? await Movie.find().sort({_id:-1}).limit(10) : await Movie.find()
            res.status(200).json(movies)
        } catch (error) {
            res.status(500).json(error)
        }
       
    } else{
        next(createError(403, "You are not authorized to see all movies!"))
    }
}