const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    // unique: true,
  },
  tag: {
    type: String,
  },
  link: {
    type: String,
    // unique: true,
  },
  isLeetcode: {
    type: Boolean,
    default: false,
  },
});

QuestionSchema.pre("save", function (next) {
  if (this.link.includes("leetcode")) {
    this.isLeetcode = true;
  }

  next();
});

module.exports = mongoose.model("Question", QuestionSchema);
