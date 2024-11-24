const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const User = require('./models/user');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const seedDB = require('./seeds');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3200;

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');
const uri = 'mongodb+srv://russu:russu@cluster0.xbwd1.mongodb.net/moldcamp';

mongoose.connect(uri);

app.use(bodyParser.urlencoded({ extended: true }));
// app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/favicontest'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();
app.use(
  require('express-session')({
    secret: 'EWEWEW',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');

  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);

app.get('/aa', (req, res) => {
  res.render('aa');
});
app.listen(port, function () {
  console.log(`Listening on ${port}`);
});
module.exports = app;