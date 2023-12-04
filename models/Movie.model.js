import mongoose from "mongoose";
const { Schema } = mongoose;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  imgTitle: {
    type: String,
    required: false,
  },
  imgSm: {
    type: String,
    required: false,
  },
  trailer: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  year: {
    type: String,
    required: false,
  },
  limit: {
    type: Number,
    required: false,
  },
  genre: {
    type: String,
    required: false,
  },
  isSeries: {
    type: Boolean,
    default:false
  },
},{
  timestamps:true
});

export default mongoose.model("Movie", MovieSchema)