const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Commentt = require('../models/comment');
const middleware = require('../middleware');
//comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) { console.log(err); }
        res.render("comments/new", { campground: campground });
    });
});
//comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Commentt.create(req.body.comment, (err, comment) => {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Comment added!");
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });

});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Commentt.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Commentt.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, editedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Commentt.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
