const Task = require('../models/taskSchema'); 
const moment = require('moment');

exports.addTask = async function (req, res) { 
    
    try {
        var created_on = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const { title, content, category, user_id } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                message: "Invalid input: 'title', 'content', and 'category' are required.",
                status: "error",
            });
        }

        const task = await Task.create({ title, content, category, created_on, user_id });

        return res.status(201).json({
            message: "Task added successfully",
            status: "success",
            data: task,
        });
    } catch (err) {
        console.error("Error adding task:", err);        
        return res.status(500).json({
            message: "An error occurred while adding the task.",
            status: "error",
            error: err.message, 
        });
    }
};




exports.getTasks = async (req, res) => {
    try {
        
        const user_id = req.body.user_id;
        const tasks = await Task.find({ user_id });  
        
        res.status(200).json({
            message: "Tasks fetched successfully",
            status: "success",
            data: tasks,
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);

        // Error response
        res.status(500).json({
            message: "An error occurred while fetching tasks.",
            status: "error",
        });
    }
};


   
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params; 
        const { title,content,category } = req.body; 

        if (!id || !title) {
            return res.status(400).json({
                message: "Task ID and task data are required.",
                status: "error",
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,           
            { title,content,category },     
            { new: true } 
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found.",
                status: "error",
            });
        }

        return res.status(200).json({
            message: "Task updated successfully.",
            status: "success",
            data: updatedTask,
        });

    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({
            message: "An error occurred while updating the task.",
            status: "error",
        });
    }
};

exports.getTaskDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Task ID is required.",
                status: "error",
            });
        }

        const taskDetail = await Task.findById(id);

        if (!taskDetail) {
            return res.status(404).json({
                message: "Task not found.",
                status: "error",
            });
        }

        return res.status(200).json({
            message: "Task details found.",
            status: "success",
            data: taskDetail,
        });

    } catch (err) {
        console.error("Error fetching task details:", err);
        res.status(500).json({
            message: "An error occurred while fetching the task details.",
            status: "error",
        });
    }
};




exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Task ID is required.",
                status: "error",
            });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found.",
                status: "error",
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully.",
            status: "success",
            data: deletedTask
        });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({
            message: "An error occurred while deleting the task.",
            status: "error",
        });
    }
};

exports.getTaskByStaus = async (req, res) => {
    try {
          const { status } = req.params;
          
          const query = status ? { status } : {};
          const tasks = await Task.find(query);
      
          res.status(200).json(tasks);
          
        } catch (error) {
          console.error("Error fetching tasks:", error);
          res.status(500).json({ message: "An error occurred while fetching tasks." });
        }
};

