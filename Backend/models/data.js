import mongoose from "mongoose";

const data = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, require: true, unique: true },
    profession: { type: String, required: true },
    imageurl: { type: String },
    dataEntryOpt: { name: { type: String, required: true }, date: { type: String } },
    extraData: []
}, { timestamps: true })

export default mongoose.model('data', data)