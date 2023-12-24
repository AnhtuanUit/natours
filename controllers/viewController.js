const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get all tour data from collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'reviews',
  );

  if (!tour) {
    return next(new AppError('The tour does not exist!', 404));
  }
  // 2) Build template

  // 3) Render data from step 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  // 1) Build template

  // 2) Render data from step 1)
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getMe = catchAsync(async (req, res) => {
  // 1) Build template

  // 2) Render data from step 1)
  res.status(200).render('account', {
    title: 'Account',
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  // 1) Find all boking tours
  const bookings = await Booking.find({ user: req.user._id });
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', { titel: 'My Tours', tours });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: newUser,
  });
});
