const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); 

// create or insert the task in the database
router.post("/",authMiddleware, async (req, res)=>{
    try{    
        const {title, description, dueDate, status, category} = req.body;
        const task = await  Task.create({
            title,
            description,
            dueDate,
            status,
            category,
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
        const query = {userId: req.user};
        if(category){
            query.category = category;
        }
        const task = await Task.find(query);
        res.status(200).json(task);
    }catch(err){
        res.status(500).json({message: 'Failed to fetch taks'});
    }
});


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