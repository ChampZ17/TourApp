import { Router } from 'express';
import {
  aliasTopFiveTours,
  getAllTours,
  getDestinationsAndCount,
  getTravelStyleAndCount,
  createTour,
  getTourBySlug,
  getTour,
  updateTour,
  deleteTour,
} from '../controller/tourController.mjs';
import { protect, restrictTo } from '../controller/authController.mjs';
import reviewRouter from './reviewRouter.mjs';

const router = Router();

router
  .route('/top-five-tours')
  .get(aliasTopFiveTours, getAllTours);

router.route('/destinations').get(getDestinationsAndCount);
router.route('/travelStyle').get(getTravelStyleAndCount);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('trn-admin', 'moderator'), createTour);

router.use('/:tourId/reviews', reviewRouter);

router.route('/slug/:slug').get(getTourBySlug);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('trn-admin', 'moderator'), updateTour)
  .delete(protect, restrictTo('trn-admin', 'moderator'), deleteTour);

export default router;
