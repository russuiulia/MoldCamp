const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');

//root route
router.get("/", (req, res) => {
    res.render("landing");
});
//register form
router.get("/register", (req, res) => {
    res.render("register");
});
//handles sign up logic
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + newUser.username);
            res.redirect("/campgrounds");
        });
    });
});
//login form
router.get("/login", (req, res) => {
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => { });

//logout logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
