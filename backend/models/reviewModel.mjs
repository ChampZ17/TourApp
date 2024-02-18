import { Schema, model } from 'mongoose';
import idValidator from 'mongoose-id-validator';

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Please type your review'],
      minlength: [10, 'A review must have more than 10 chaacter'],
    },
    rating: {
      type: Number,
      default: 3,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!!!'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an User!!!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.plugin(idValidator);

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await (stats.length > 0
    ? this.model('Tour').findByIdAndUpdate(tourId, {
        reviewsQuantity: stats[0].nRating,
        rating: stats[0].avgRating,
      })
    : this.model('Tour').findByIdAndUpdate(tourId, {
        reviewsQuantity: 0,
        rating: 0,
      }));
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.getUpdatedTourId = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {

  await this.getUpdatedTourId.constructor.calcAverageRatings(
    this.getUpdatedTourId.tour,
  );
});

const Review = model('Review', reviewSchema);
export default Review;
