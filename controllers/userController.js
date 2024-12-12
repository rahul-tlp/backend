const User = require('../models/userSchema'); 
const bcrypt = require('bcryptjs'); // For password hashing and verification
const SECRET_KEY = 'test1243rahul'
const jwt = require('jsonwebtoken');


exports.addUser = async function (req, res) {
    try {
        const { name, email, password, mobile, gender } = req.body;

        if (!name || !email || !password || !mobile || !gender) {
            return res.status(400).json({
                message: "Invalid input: 'name', 'email', 'password', 'mobile', and 'gender' are required.",
                status: "error",
            });
        }

        const token = null;

        const newUser = await User.create({ name, email, password, mobile, gender,token });

        return res.status(201).json({
            message: "User added successfully",
            status: "success",
            data: newUser, 
        });
    } catch (err) {
        console.error("Error adding user:", err);

        // Error response
        return res.status(500).json({
            message: `An error occurred while adding the user${err.errmsg}`,
            status: "error",
        });
    }
};

exports.updateUserDetails = async function (req, res) {
    try {
        const { id } = req.params; // Assuming the user ID is passed as a URL parameter
        const { name, email, password, mobile, gender } = req.body;

        // Validate if an ID is provided
        if (!id) {
            return res.status(400).json({
                message: "User ID is required for update.",
                status: "error",
            });
        }

        // Validate at least one field to update is provided
        if (!name && !email && !password && !mobile && !gender) {
            return res.status(400).json({
                message: "At least one field (name, email, password, mobile, gender) is required to update.",
                status: "error",
            });
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password, mobile, gender },
            { new: true, runValidators: true } // Return the updated document and validate input
        );

        // Check if user exists
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found.",
                status: "error",
            });
        }

        // Success response
        return res.status(200).json({
            message: "User updated successfully.",
            status: "success",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error updating user details:", err);

        // Error response
        return res.status(500).json({
            message: "An error occurred while updating the user.",
            status: "error",
        });
    }
};



exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                status: "error",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first.",
                status: "error",
            });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password.",
                status: "error",
            });
        }

        // Update token
        const updatedToken = await updateToken(user);

        // Response
        return res.status(200).json({
            message: "Login successful",
            status: "success",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: updatedToken,
            },
        });
    } catch (err) {
        console.error("Error logging in user:", err);

        return res.status(500).json({
            message: "An error occurred during login.",
            status: "error",
        });
    }
};

async function updateToken(userData) {
    try {
        // Generate a new token
        const payload = { id: userData._id, email: userData.email };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        // Update the token in the database and return the updated token
        const updatedUser = await User.findByIdAndUpdate(
            userData._id,
            { token },
            { new: true } // Return the updated document
        );

        return updatedUser.token;
    } catch (err) {
        console.error("Error updating token:", err);
        throw new Error("Failed to update token in database.");
    }
}


// Protected Route Controller
exports.getProtectedData = (req, res) => {
    res.status(200).json({
        message: "Access to protected data granted",
        user: req.user, // Extracted from the JWT token
    });
};



exports.getUser = async (req, res) => {
    try {
        const users = await User.find();
        console.log('Retrieved User:', users);

        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching User:", err);
        res.status(500).json({ message: "An error occurred while fetching user." });
    }
};

exports.getUserByid = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }
  
      return res.status(200).json({message:"User Details Found",user:user});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
   
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params; 
        const { title,description,status } = req.body; 

        if (!id || !title) {
            return res.status(400).json({
                message: "Task ID and task data are required.",
                status: "error",
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,           
            { title,description,status },     
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
          
          console.log(status);
          
      
          const query = status ? { status } : {};
          const tasks = await Task.find(query);
      
          res.status(200).json(tasks);
          
        } catch (error) {
          console.error("Error fetching tasks:", error);
          res.status(500).json({ message: "An error occurred while fetching tasks." });
        }
};

