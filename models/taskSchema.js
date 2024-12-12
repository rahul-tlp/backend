const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    created_on: {
        type: String,
        required: true,
    },
    update_on:{
        type: String,
    }
});

const Task = mongoose.model('Task', taskSchema); // Export the model
module.exports = Task;

