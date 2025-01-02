const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); 

// create or insert the task in the database
router.post("/",authMiddleware, async (req, res)=>{
    try{    
        const {title, description, dueDate, status} = req.body;
        const task = await  Task.create({
            title,
            description,
            dueDate,
            status,
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
        const task = await Task.find({userId: req.user});
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