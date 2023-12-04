import User from "../models/User.model.js"
import bcrypt from 'bcrypt';
import createError from "../utils/createError.js";

//UPDATE
export const updateUser = async (req, res, next) => {
            if(req.user.id === req.params.id || req.user.isAdmin){
                if(req.body.password){
                    const hash = bcrypt.hashSync(req.body.password, 10);
                    req.body.password = hash;
                }
                try {
                    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                        $set: req.body
                    }, {new: true})
                    res.status(200).json(updatedUser)
                } catch (error) {
                    next(error)
                }
            } else{
                next(createError(403, "You can update only your account!"))
            } 
}

//DELETE
export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if(req.cookieUserId !== user._id.toString() && !req.cookieAdmin){
        return next(createError(401, "You are not authorized"))
    }
    
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send("User has been deleted!")
    } catch (error) {
        next(error)
    }
}


//GET
export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    
    const {password, ...userWithoutPassword} = user._doc
    res.status(200).send(userWithoutPassword)
}

//GET ALL
export const getAllUsers = async (req, res, next) => {
    const query = req.query.new;
    if(req.cookieAdmin){

        try {
            const users = query ? await User.find().sort({_id:-1}).limit(10) : await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
       
    } else{
        next(createError(403, "You are not authorized to see all users!"))
    }
}

//GET USER STATS
export const getUserStats = async (req, res, next) => {
    // const date = new Date()
    // const lastYear =  new Date(date.setFullYear(date.getFullYear()-1))
    try{
        const data = await User.aggregate([
            // {$match: {createdAt: {$gte: lastYear}}},
            {$project:{
                month: {$month : "$createdAt"},
                day: {$dayOfMonth : "$createdAt"}
            }},
            {
                $group:{
                    _id: { month: "$month", day: "$day" },
                    total: { $sum: 1 }
                    }
            },
            {
                $sort: { "_id.month": 1, "_id.day": 1 }
            }
        ])
        res.status(200).json(data)
    }   catch (error) {
        res.status(500).json(error)
    }
}