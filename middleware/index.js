const Campground = require('../models/campground');
const Commentt = require('../models/comment');
const middlewareObj = {};
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Commentt.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!")
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in!")
    res.redirect("/login");
};

module.exports = middlewareObj;