import { Router } from 'express';

import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getAllUsers,
  getRoleAndCount,
  updateUser,
  deleteUser,
} from '../controller/userController.mjs';
import {
  signup,
  login,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} from '../controller/authController.mjs';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('trn-admin'));

router.route('/').get(getAllUsers);
router.route('/role').get(getRoleAndCount);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
