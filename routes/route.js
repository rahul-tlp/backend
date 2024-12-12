const express = require('express');
const taskController = require('../controllers/taskController.js')
const userController = require('../controllers/userController.js')
const authenticateJWT = require('../config/auth.js')
var router = express.Router();

router.post('/task/add', authenticateJWT, taskController.addTask);

router.get('/task/get', authenticateJWT, taskController.getTasks);

router.put('/task/update/:id', authenticateJWT, taskController.updateTask);

router.get('/task/:id', authenticateJWT, taskController.getTaskDetail)

router.delete('/task/delete/:id', authenticateJWT, taskController.deleteTask);

router.get('/task/get/:status',taskController.getTaskByStaus);

router.post('/user/login',userController.loginUser);

router.post('/user/add',userController.addUser);

router.get('/user/get',userController.getUser);

router.get('/user/get/:id',userController.getUserByid);

router.put('/user/update/:id', userController.updateUserDetails)

module.exports = router