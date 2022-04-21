const express = require("express");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/");
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/problems");
    } else {
      next();
    }
  },

  restrict: (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(400).json({
        message: "you are not authorized",
      });
    }
  },
};


