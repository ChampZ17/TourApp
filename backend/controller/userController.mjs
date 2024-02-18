import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getDistinctValueAndCount,
} from '../utils/handlerFactory.mjs';

const { findByIdAndUpdate } = User;

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

export function getMe(request, response, next) {
  request.params.id = request.user.id;
  next();
}

export const getRoleAndCount = getDistinctValueAndCount(User, 'role');

export const updateMe = catchAsync(async (request, response, next) => {
  const allowedFields = ['name', 'email', 'photo'];

  for (const element of Object.keys(request.body)) {
    if (!allowedFields.includes(element)) {
      next(
        new AppError(
          `This route is used just for update ${allowedFields}!!! Please try again!!!`,
          400,
        ),
      );
      continue;
    }
  }


  const updatedUser = await findByIdAndUpdate(
    request.user.id,
    request.body,
    {
      new: true,
      runValidators: true,
    },
  );

  response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (request, response, next) => {
  await findByIdAndUpdate(request.user.id, { active: false });

  response.status(200).json({
    status: 'success',
  });
});
