const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        // --- Task Core Fields ---
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "completed", "in progress"],
            default: "pending",
        },
        dueDate: {
            type: Date,
        },

        // --- Ownership ---
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        // --- Collaboration (NEW) ---
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: false, // only required for team tasks
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // optional - allows multi-assignment later if needed
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

         // --- Task Classification ---
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
                },
            },
        ],

        // --- Activity & Analytics (optional future use) ---
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        activity: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                action: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],

    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Task", taskSchema);