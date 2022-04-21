const ejs = require("ejs");
const User = require("../server/Models/User");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();
let month = monthNames[date.getMonth()];
let todayDate = date.getUTCDate();

module.exports = function sendEmail(
  user,
  toEmail = null,
  emailTokenNew = null,
  personal = false
) {
  var totalDate = `Hey ${user.firstName} Here is your daily DSA Problem set ☺️ : ${todayDate}-${month}`;
  // FETCH PROBLEMS FOR MAIL

  function fetchQuestions(tag, problems) {
    let date = Date.now();
    var arrayQ = [];

    problems.forEach((prob) => {
      if (prob.tag === tag && date - prob.date > 432000000) {
        arrayQ.push(prob);
      }
    });
    var size = arrayQ.length;

    if (size == 0) {
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

  async function fetchProblesmForEmail(userId) {
    let user = await User.findOne({ _id: userId });
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

    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          // TODO: change
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      })
    );
    // exec is important
    User.updateOne(
      { _id: user._id },
      {
        $set: {
          emailToken: emailTokenNew,
        },
      }
    ).exec();

    ejs.renderFile(
      __dirname + "/emailproblem.ejs",
      {
        user,
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
        emailTokenNew,
      },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          var mailOptions = {
            from: "akshansh773@gmail.com",
            to: toEmail,
            subject: totalDate,
            html: data,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
      }
    );
  } // problem email fucntion end

  let userId = user._id;
  if (!personal) fetchProblesmForEmail(userId);
  else {
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      })
    );

    var mailOptions = {
      from: "akshansh773@gmail.com",
      to: "akshansh773@gmail.com",
      subject: `${user.displayName} just submitted problems 🎉`,
      html: `<h1>New User just submitted problems</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}; // main email fucntion ending
