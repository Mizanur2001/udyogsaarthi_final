import mongoose from "mongoose";
//name and phone is mandetory
const columnData = new mongoose.Schema({
    defaultData: { type: Array, default: ['name', 'email', 'phone', 'profession'] },
    addColumn: { type: Array }
}, { timestamps: true })


export default mongoose.model('columnData', columnData)