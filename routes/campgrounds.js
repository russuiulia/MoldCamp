const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const middleware = require('../middleware');
//index route
router.get("/", (req, res) => {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user });
        }
    })

});
//add new campground to db
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = { name: name, image: image, description: description, author: author, price: price };
    console.log(req.user);
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//new campground forn
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});
//show more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, editedCampground) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//destroy 
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }

    })
});

module.exports = router;