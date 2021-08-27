const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//logic to check for error in connecting monodb
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
//can name whatever we want to use in our submit route
//we will pass in _method in form submit path
app.use(methodOverride("_method"));
//middleware for success flash

//tells express to serve public folder
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    //prevents access to cookie from browser
    httpOnly: true,
    //expires session in one week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  // store: mongoStore
}


app.use(session(sessionConfig));
app.use(flash());

//using passport middleware 
//used so user does not have to login on every request
//must be under app.use session
app.use(passport.initialize());
app.use(passport.session());
//tells passport to use localStrategy and authenticaion method will be located on our user model called authenticate
//we dont have method on model that wew made but is included in passport
passport.use(new LocalStrategy(User.authenticate()));
//how do we store user in session
passport.serializeUser(User.serializeUser());
//how do we get user out of session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  //automatically have access to this in templete
  //do not have to pass through, put before route handlers
  res.locals.success = req.flash('success');
  //if anything stored in flash as error this is called
  res.locals.error = req.flash('error');
  next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

//only runs if nothing else manages error
//appilied on all routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something Went Wrong!'
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
