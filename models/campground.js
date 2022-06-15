const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            href: "User"
        },
        username: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
});
module.exports = Campground = mongoose.model("Campground", campgroundSchema);

