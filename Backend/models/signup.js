import mongoose from "mongoose"

const signUp = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    phone: { type: Number, require: true, unique: true },
    age: { type: Number, require: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' },
    adminChangeStatus: { adminName: { type: String, default: null }, time: { type: String, default: null } }
}, { timestamps: true })

export default mongoose.model('Users', signUp)