const GoogleStrategy = require("passport-google-oauth20").Strategy;

const mongoose = require("mongoose");
const Question = require("../server/Models/Question");

const User = require("../server/Models/User");

const sendEmail = require("../config/email");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },

      async (_accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          problems: [],
          email: profile.emails[0].value,
          role: "public",
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            let questions = await Question.find({});

            let dateOld = new Date(1 / 12 / 2022);

            questions.forEach((prob) => {
              let obj = {
                title: "",
                tag: "",
                link: "",
                date: "",
                revisionFreq: 5,
              };
              if (
                prob.title != undefined &&
                prob.link != undefined &&
                prob.tag != undefined
              ) {
                if (prob.title != "" && prob.tag != "" && prob.link != "") {
                  obj.title = prob.title;
                  obj.tag = prob.tag;
                  obj.questionID = prob._id.toString();
                  obj.link = prob.link;
                  obj.date = dateOld;
                  obj.isLeetcode = prob.isLeetcode;
                  newUser.problems.push(obj);
                }
              }
            });

            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          res.render("error", {
            message: "Login Failed, Please try again !",
          });
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
