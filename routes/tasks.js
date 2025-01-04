const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); 

// create or insert the task in the database
router.post("/",authMiddleware, async (req, res)=>{
    try{    
        const {title, description, dueDate, status, category, priority} = req.body;
        const task = await  Task.create({
            title,
            description,
            dueDate,
            status,
            category,
            priority,
            userId : req.user,
        });
        res.status(201).json(task);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Task creation failed"});
    }
});

// fetch all the tasks from the database
router.get("/", authMiddleware, async (req, res)=>{
    try{
        const { category} = req.query;
        const { priority } = req.query;
        const query = {userId: req.user};
        if(category){
            query.category = category;
        }
        if(priority){
            query.priority = priority;
        }
        const task = await Task.find(query);
        res.status(200).json(task);
    }catch(err){
        res.status(500).json({message: 'Failed to fetch taks'});
    }
});

router.post("/:id/subtasks", authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params;
        const {title} = req.body;

        if(!title){
            return res.status(400).json({error: "Subtask title is required"});
        }

        const task = await Task.findOneAndUpdate(
            {_id: id, userId: req.user},
            { $push: {subtasks: {title}}},
            {new: true},
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({ error: "Failed to add subtask" });
    }
});

// update field of task
router.put("/:id", authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params;
        const updates = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user}, 
            updates, 
            {new: true},
        );
        
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        res.status(200).json(task);
    }
    catch(err){
        res.status(500).json({message: "Failed to update task"});
    }
});

// update category of task
router.put("/:id/category", authMiddleware, async (req, res)=>{
    const { id } = req.params; // Task ID
    const { category } = req.body; // New category from request body

    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }

    try{
        const task = await Task.findOneAndUpdate(
            {_id: id, userId: req.user},
            {category},
            {new: true},
        );

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        res.status(201).json({ message: "Task category updated successfully"});
    }catch(err){
        console.error("Error updating task category:", err);
        res.status(500).json({message: "Failed to update task category"});
    }
});

// update priority of task
router.put("/:id/priority", authMiddleware, async (req, res)=>{
    const { id } = req.params; // Task ID
    const { priority } = req.body; // New priority from request body

    if (!["Low", "High", "Medium"].includes(priority)) {
        return res.status(400).json({ error: "Invalid priority value" });
    }
    try{
        const task = await Task.findOneAndUpdate(
            {_id: id, userId: req.user},
            {priority},
            {new: true},
        );

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        res.status(201).json({ message: "Task priority updated successfully"});
    }catch(err){
        console.error("Error updating task priority:", err);
        res.status(500).json({message: "Failed to update task priority"});
    }
});

router.put("/:id/subtasks/:subtaskId", authMiddleware, async(req, res)=>{
    try{
        const {id, subtaskId} = req.params;
        const { title, status } = req.body;

        const updateFields = {};

        if (title) updateFields["subtasks.$.title"] = title;
        if(!["Pending", "In-Progres", "Completed"].includes(status)){
            return res.status(400).json({ error: "Invalid status value"});
        }else{
            updateFields["subtasks.$.status"] = status;
        }

        const task = await Task.findOneAndUpdate(
            {_id: id, userId: req.user, "subtasks._id": subtaskId},
            {$set: updateFields},
            {new: true},
        );

        if (!task) {
            return res.status(404).json({ error: "Task or subtask not found" });
        }

        res.status(200).json({ message: "Subtask updated successfully", task });
    }catch(error){
        console.error("Error updating subtask:", error);
        res.status(500).json({error: "Failed to update subtasks status"});
    }
})

// delete task
router.delete("/:id", authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params;
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user});
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        res.status(200).json({message: "Task deleted successfully"});
    }catch(err){
        res.status(500).json({error: "Failed to delete task"});
    }
});

module.exports = router;