const fs = require("fs");
const Leetcode = require("./server/Models/Leetcode");

const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akki123:akki123@cluster0.h8usq.mongodb.net/reviseDSA?retryWrites=true&w=majority"
    ),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
    console.log("database connected");
  } catch (error) {
    // TODO: handle errors
    console.log(error);
    process.exit(1);
  }
};

const leetcodeQuestions = JSON.parse(
  fs.readFileSync(`${__dirname}/leetcode.json`, "utf-8")
);

// console.log(leetcodeQuestions);

const importData = async () => {
  try {
    /// change it to create
    await Leetcode.create(leetcodeQuestions);

    console.log("data imported! 😊😊😊");
  } catch (error) {
    console.log(error);
  }
};



const deleteData = async () => {
  try {
    await Leetcode.deleteMany();
    console.log("data deleted! 😊😊😊");
  } catch (error) {
    console.log(error);
  }
};

// deleteData();
connectDb();
importData();
