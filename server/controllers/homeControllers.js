const Question = require("../Models/Question");
const User = require("../Models/User");
const Leetcode = require("../Models/Leetcode");

var gateway = false;
const sendEmail = require("../../config/email");

module.exports.home = async function (req, res) {
  res.render("home");
};

function fetchQuestions(tag, problems) {
  let date = Date.now();
  var arrayQ = [];
  // prob.tag === tag &&
  // date - prob.date > milliseconds &&

  // for priority questions
  problems.forEach((prob) => {
    let milliseconds = prob.revisionFreq * 24 * 60 * 60 * 1000;
    let oldDate = new Date("1970-01-01T00:00:00.000Z");
    if (
      prob.tag === tag &&
      prob.date - oldDate != 0 &&
      date - prob.date >= milliseconds &&
      (prob.isPriority === true || prob.isLeetcode === true)
    ) {
      arrayQ.push(prob);
    }
  });

  problems.forEach((prob) => {
    let oldDate = new Date("1970-01-01T00:00:00.000Z");
    let milliseconds = prob.revisionFreq * 24 * 60 * 60 * 1000;
    if (
      prob.tag === tag &&
      prob.date - oldDate != 0 &&
      date - prob.date > milliseconds &&
      prob.isLeetcode === false
    ) {
      arrayQ.push(prob);
    }
  });

  // console.log("ARRAY SIZE ☺️", arrayQ.length);

  if (arrayQ.length === 0) {
    // for old questions
    problems.forEach((prob) => {
      let milliseconds = 30 * 24 * 60 * 60 * 1000;
      if (prob.tag === tag && date - prob.date >= milliseconds) {
        arrayQ.push(prob);
      }
    });
  }

  var size = arrayQ.length;

  if (size === 0) {
    return {
      link: "#",
      title:
        "Take a BREAK , You Have tried all questions from this topic in last 5 Days",
    };
  }

  var randomN = Math.floor(Math.random() * size);
  // console.log(arrayQ);
  return arrayQ[randomN];
}

module.exports.problems = async function (req, res) {
  try {
    let user = await User.findOne({ _id: req.user.id });

    // let user = await User.findOne({ role: "admin" });
    // res.locals.user = user;

    const problems = user.problems;

    const arrayQuestion = fetchQuestions("Array", problems);
    const stringQuestion = fetchQuestions("String", problems);
    const sortingQuestion = fetchQuestions("Searching & Sorting", problems);
    const linkedList = fetchQuestions("LinkedList", problems);
    const binaryTrees = fetchQuestions("Binary Trees", problems);
    const binarySearchTrees = fetchQuestions("Binary Search Trees", problems);
    const greedy = fetchQuestions("Greedy", problems);
    const backTracking = fetchQuestions("BackTracking", problems);
    const stacksandQueues = fetchQuestions("Stacks & Queues", problems);
    const Heap = fetchQuestions("Heap", problems);
    const Graph = fetchQuestions("Graph", problems);
    const Trie = fetchQuestions("Trie", problems);
    const DynamicProgramming = fetchQuestions("Dynamic Programming", problems);
    const BitManipulation = fetchQuestions("Bit Manipulation", problems);

    res.render("problems", {
      arrayQuestion,
      stringQuestion,
      sortingQuestion,
      linkedList,
      binaryTrees,
      binarySearchTrees,
      greedy,
      backTracking,
      stacksandQueues,
      Heap,
      Graph,
      Trie,
      DynamicProgramming,
      BitManipulation,
    });
  } catch (error) {
    console.log(error + "😔😔😔");
    res.render("error", {
      message: "Cannot Fetch Problems Please try again",
    });
  }
};

function updateUserDate(id, questionID, freq) {
  let date = new Date();

  User.updateOne(
    {
      _id: id,
      "problems.questionID": questionID,
    },

    {
      $set: {
        "problems.$.date": date,
        "problems.$.revisionFreq": freq,
      },
    }
  ).exec(function (err, user) {
    if (err) {
      console.log(err);
      return null;
    } else {
      // console.log(user);
    }
  });
}

module.exports.complete = function (req, res) {
  try {
    // res.json(req.body);

    let id = req.user.id;

    const problemobj = req.body;

    var resultArray = Object.keys(problemobj).map((key) => [
      key.toString(),
      problemobj[key],
    ]);

    for (let index = 0; index < resultArray.length - 1; index += 2) {
      let questionID = resultArray[index][1].trim();
      let freq = Math.abs(resultArray[index + 1][1] * 1);
      console.log(questionID);
      console.log(freq);

      if (updateUserDate(id, questionID, freq) === null) {
        throw "Cannot Update Questions";
      }
    }

    console.log(resultArray);
    res.redirect("/success");
  } catch (error) {
    console.log(error);
    res.render("error", {
      message: error,
    });
  }
};

module.exports.error = function (req, res) {
  res.render("error");
};
module.exports.success = function (req, res) {
  res.render("success");
};

module.exports.unsubscribe = async function (req, res) {
  let emailToken = req.params.id;
  console.log(emailToken);
  try {
    let user = await User.findOne({ emailToken });

    if (!user) {
      throw "User not Found";
    }

    if (user.subscribed === false) {
      throw "You are already Unsubscribed";
    }

    User.updateOne(
      { emailToken: emailToken },
      {
        $set: {
          subscribed: false,
        },
      }
    ).exec((err, user) => {
      if (!err) {
        res.json("You have successfully unsubscribed from the list");
      }
    });
  } catch (error) {
    res.render("error", {
      message: error,
    });
  }
};

exports.addProblems = async (req, res) => {
  res.render("addProblems");
};

exports.addProblemsForm = async (req, res) => {
  try {
    const { link, tag } = req.body;
    let date = new Date(Date.now());
    const user = req.user;
    const isPresent = await Question.findOne({ link: link });

    if (!isPresent) {
      const titleSlug = link.split("problems")[1];
      const title = titleSlug.slice(1, titleSlug.length - 1);
      const obj = {
        ...req.body,
        title,
      };
      const newQuestion = await Question.create(obj);
      const questionID = newQuestion._id.toString();

      const userQuestion = {
        link,
        tag,
        title,
        questionID,
        date,
        revisionFreq: 2,
        isLeetcode: true,
        isPriority: true,
      };
      const currentUser = await User.findById(user._id);
      currentUser.problems.push(userQuestion);
      await currentUser.save();
    } else {
      const id = user._id;

      User.updateOne(
        {
          _id: id,
          "problems.link": link,
        },

        {
          $set: {
            "problems.$.date": date,
            "problems.$.revisionFreq": 2,
          },
        }
      ).exec(function (err, user) {
        if (err) {
          console.log(err);
        } else {
          console.log(user);
        }
      });
    }

    res.redirect("/success");
  } catch (error) {
    console.log(error + "😔");
  }
};
