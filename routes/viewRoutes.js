const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getMe);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
router.get('/my-tours', authController.protect, viewController.getMyTours);

// After this middleware, all routes though check logged in
router.use(authController.isLogged);
router.get(
  '/',
  // bookingController.createBookingCheckout,
  viewController.getOverview,
);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
