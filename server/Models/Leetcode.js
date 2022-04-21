const mongoose = require("mongoose");

const slugify = require("slugify");

const LeetcodeSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  tag: {
    type: String,
  },
  link: {
    type: String,
  },
  Free: {
    type: String,
  },

  Ldratio: {
    type: Number,
  },
  Category: {
    type: String,
  },

  AcceptanceRate: {
    type: Number,
  },

  isLeetcode: {
    type: Boolean,
    default: true,
  },
});

// LeetcodeSchema.index({ title: 1, link: 1 }, { unique: true });

LeetcodeSchema.pre("save", function (next) {
  this.title = this.title.trim();
  this.title = this.title.replace("Trees", "Tree");

  let categoriesArr = this.tag.split(",");
  categoriesArr = categoriesArr.map((el) => el.trim());

  const our = [
    "Array",
    "String",
    "Searching & Sorting",
    "LinkedList",
    "Binary Trees",
    "Binary Search Trees",
    "Greedy",
    "BackTracking",
    "Stacks & Queues",
    "Heap",
    "Graph",
    "Trie",
    "Dynamic Programming",
    "Bit Manipulation",
  ];

  categoriesArr.forEach((tag) => {
    if (our.includes(tag)) {
      this.tag = tag;
    } 
  });

  // this is document which is going to save

  const slug = slugify(this.title, {
    lower: true,
  });

  this.link = `https://leetcode.com/problems/${slug}/`;

  this.Ldratio = Math.round(this.Ldratio * 1);

  this.AcceptanceRate = Math.round(this.AcceptanceRate * 1);

  next(); // just like express
});

module.exports = mongoose.model("Leetcode", LeetcodeSchema);
