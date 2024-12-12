const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://rahul525230:mcE6RkAwZ8QeBdwi@notes.evueu.mongodb.net/?retryWrites=true&w=majority&appName=Notes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;