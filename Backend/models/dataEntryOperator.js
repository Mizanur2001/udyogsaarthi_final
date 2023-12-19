import mongoose from "mongoose";

const dataEntryOperator = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    phone: { type: Number, require: true, unique: true },
    adminType: { type: String, default: 'Data Entry Operator' },
    password: { type: String, required: true },
    permissions: { edit: { type: Boolean, default: false }, entry: { type: Boolean, default: false } },
    totalEntry: [],
}, { timestamps: true })

export default mongoose.model('dataEntryOperator', dataEntryOperator)