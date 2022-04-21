const express = require("express");
const ejs = require("express-ejs-layouts");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const database = require("./config/databaseConfig");
const passport = require("passport");
// const sendMail = require("./config/email");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cron = require("node-cron");
const schedule = require("node-schedule");
const User = require("./server/Models/User");

dotenv.config({
  path: "./config/.env",
});

database();

const app = express();
const port = 8000;

app.use(flash());

require("./config/passport")(passport);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser("secretString"));
app.use(express.json());

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 * 1 },
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(ejs);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use("/", require("./server/routes/index"));
app.use("/auth", require("./server/routes/auth"));

app.listen(process.env.PORT || port, () => {
  console.log(`server running on ${port} `);
});
