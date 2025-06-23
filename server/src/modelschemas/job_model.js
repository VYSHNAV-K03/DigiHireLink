const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("job", jobSchema)