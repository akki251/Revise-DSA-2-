const express = require("express");

const router = express.Router();
const {
  ensureAuth,
  ensureGuest,
  restrict,
} = require("../middlewares/authMiddleware");

const homeControllers = require("../controllers/homeControllers");
const Leetcode = require("../Models/Leetcode");
const Question = require("../Models/Question");

// router.get("/uploadmega", async (req, res, next) => {
//   const problems = await Leetcode.find();

//   const megaUpload = await Question.insertMany(problems);

//   res.status(200).json({
//     status: "Success",
//     results: megaUpload.length,
//     data: {
//       megaUpload,
//     },
//   });
// });

router.get("/getData", async (req, res, next) => {
  const problems = await Question.find();

  res.status(200).json({
    resutls: problems.length,
    problems,
  });
});

router.get("/", ensureGuest, homeControllers.home);
router.get("/problems", ensureAuth, homeControllers.problems);
// router.get("/problems", homeControllers.problems);
router.post("/error", ensureAuth, homeControllers.error);
router.get("/success", homeControllers.success);
// router.get(`/${process.env.GOOGLE_CLIENT_ID}`, homeControllers.sendEmail);
router.post("/complete", ensureAuth, homeControllers.complete);
router.get("/unsubscribe/:id", homeControllers.unsubscribe);

router
  .route("/addProblems")
  .get(ensureAuth, restrict, homeControllers.addProblems)
  .post(homeControllers.addProblemsForm);

module.exports = router;
