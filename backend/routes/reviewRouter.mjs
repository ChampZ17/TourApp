import { Router } from 'express';
import {
  getAllReviews,
  setTourUserIds,
  createReview,
  getReview,
  checkReviewOwner,
  updateReview,
  deleteReview,
} from '../controller/reviewController.mjs';
import { protect, restrictTo } from '../controller/authController.mjs';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(protect, restrictTo('user', 'trn-admin'), checkReviewOwner, updateReview)
  .delete(protect, restrictTo('user', 'trn-admin'), checkReviewOwner, deleteReview);
export default router;
