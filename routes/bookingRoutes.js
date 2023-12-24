const express = require('express');

const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// All route need protect
router.use(authController.protect);

// Protect all route after this line
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// Only admin can manage bookings
router.use(authController.restrictTo('lead-guide', 'admin'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
