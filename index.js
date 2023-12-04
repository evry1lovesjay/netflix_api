import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from 'cors';
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import movieRoute from "./routes/movie.route.js"
import listRoute from "./routes/list.route.js"

const app = express()
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connection successful")
    } catch (error) {
        console.log(error)
    }
}

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.VITE_CLIENT_URL_PROD
  : process.env.VITE_CLIENT_URL_DEV;

app.use(cors({origin:`${API_URL}`, credentials:true}))


app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"

    return res.status(errorStatus).send(errorMessage)
})

const PORT = process.env.PORT || 9200

app.listen(PORT, ()=>{
    connect()
    console.log("Backend server started")
})