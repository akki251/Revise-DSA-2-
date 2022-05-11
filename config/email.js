const ejs = require("ejs");
const User = require("../server/Models/User");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

module.exports = function sendEmail(user) {
  // problem email fucntion end

  let userId = user._id;

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

  // console.log(user);
  var mailOptions = {
    from: "akshansh773@gmail.com",
    to: "akshansh261@gmail.com",
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
}; // main email fucntion ending
