const express = require("express");
const passport = require("passport");
const router = express.Router();

// route  /auth/google
router.get(
  "'/auth/google'",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/problems");
  }
);

// logout user
// @route  /auth/logout

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
