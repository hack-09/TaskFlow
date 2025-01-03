const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "in progress"],
            default: "pending",
        },
        dueDate: {
            type: Date,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: false,
            default: "General",
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Task", taskSchema);