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
        priority:{
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        subtasks:[
            {
                title:{type: String, required: true},
                status: {
                    type: String,
                    enum: ["Pending", "In-Progres", "Completed"],
                    default: "Pending",
                }
            }
        ],
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Task", taskSchema);