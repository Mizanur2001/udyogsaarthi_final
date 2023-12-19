import mongoose from "mongoose";

const superAdmin = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    adminType: { type: String, default: "Super Admin" },
    password: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('superAdmin', superAdmin)