const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Ensures a 10-digit number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], // Restrict to specific values
    },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
