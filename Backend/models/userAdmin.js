import mongoose from "mongoose";

const userAdmin = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    phone: { type: Number, require: true, unique: true },
    adminType: { type: String, default: 'User Admin' },
    password: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('userAdmin', userAdmin)