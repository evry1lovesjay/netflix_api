import List from "../models/List.model.js"
import createError from "../utils/createError.js";

//CREATE
export const createList = async (req, res, next) => {
    if(req.cookieAdmin){
        const newList = new List(req.body)
        try {
            const savedList = await newList.save() 
            res.status(200).json(savedList)
        } catch (error) {
           res.status(500).json(error)
        }
    } else{
        next(createError(403, "You are not allowed to add a new list!"))
    } 
}

//UPDATE
export const updateList = async (req, res, next) => {
    if(req.cookieAdmin){
        try {
            const updatedList = await List.findByIdAndUpdate(req.params.id,
                {$set: req.body}, {new: true})
            res.status(200).json(updatedList)
        } catch (error) {
           res.status(500).json(error)
        }
    } else{
        next(createError(403, "You are not allowed to update any list!"))
    } 
}

//DELETE
export const deleteList = async (req, res, next) => {
    if(req.cookieAdmin){
        try{
            await List.findByIdAndDelete(req.params.id)
            res.status(200).send("The List has been deleted!")
        } catch (error) {
            next(error)
        }
    } else{
        return next(createError(401, "You are not authorized"))
    }
}


//GET
export const getList = async (req, res, next) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = []

    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    { $match: {type: typeQuery, genre: genreQuery} },
                    { $sample: {size: 5} },
                ])
            } else{
                list = await List.aggregate([
                    { $match: {type: typeQuery} },
                    { $sample: {size: 5} },
                ])
            }

        } else {
            list = await List.aggregate([
                { $sample: {size: 5} },
            ])
        }
        res.status(200).send(list)
    } catch (error) {
        next(error)
    }
}

//GET RANDOM
export const getRandomList = async (req, res, next) => {
    const type = req.query.type
    let list
    try {
        if(type === "series"){
            list = await List.aggregate([
                { $match: {isSeries: true} },
                { $sample: {size: 1} },
            ])
        } else {
            list = await List.aggregate([
                { $match: {isSeries: false} },
                { $sample: {size: 1} },
            ])
        }
        res.status(200).send(list)
    } catch (error) {
        next(error)
    }
}

//GET ALL
export const getAllLists = async (req, res, next) => {
    const query = req.query.new;
    if(req.cookieAdmin){

        try {
            const lists = query ? await List.find().sort({_id:-1}).limit(5) : await List.find()
            res.status(200).json(lists)
        } catch (error) {
            res.status(500).json(error)
        }
       
    } else{
        next(createError(403, "You are not authorized to see all lists!"))
    }
}