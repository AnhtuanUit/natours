const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

router.get(
  '/top-5-cheap',
  tourController.aliasTopCheap,
  tourController.getAllTours,
);
router.get('/stats', tourController.getTourStats);
router.get(
  '/monthly-plan/:year',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan,
);

// router.param('id', tourController.checkID);
router.use('/:tourId/reviews', reviewRouter);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
