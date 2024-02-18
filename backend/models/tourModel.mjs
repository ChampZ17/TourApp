import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        120,
        'A tour name must have less than or equal to 120 characters',
      ],
      minlength: [
        10,
        'A tour name must have more then or equal to 10 characters',
      ],
    },
    slug: { type: String, lowercase: true, unique: true },
    destinations: {
      type: [String],
    },
    duration: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      required: [true, 'A tour must have a duration'],
      validate: {
        validator: (number) => number.isInteger && number > 0,
        message: 'Duration must be a Natural Number',
      },
    },
    travelStyle: {
      type: [String],
      required: [true, 'A tour must have travel styles'],
    },
    rating: {
      type: Number,
      default: 0,
      set: (value) => Math.round(value * 10) / 10,
    },
    reviewsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      validate: {
        validator: (number) => number > 0,
        message: 'Price must be greater than 0',
      },
    },
    oldPrice: {
      type: Number,
      validate: {
        validator(value) {
          return value > this.price || value === 0;
        },
        message: 'Old price ({VALUE}) should be higher than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    highlights: {
      type: [String],
      required: [true, 'A tour must have highlight'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    timeline: [
      {
        title: {
          type: String,
          required: [true, "A timeline must have day's title"],
        },
        description: {
          type: String,
          required: [true, "A timeline must have day's description"],
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});


tourSchema.pre('save', function (next) {
  const slugName = slugify(this.name, {
    lower: true,
    locale: 'vi',
    remove: /[!"'()*+./:@~-]/g,
  });

  const randomString = Math.random().toString(36).slice(8);

  this.slug = `${slugName}-${randomString}`;
  next();
});


tourSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true },
  async function () {
    await this.model('Review').deleteMany({ tour: this._id });
  },
);

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  next();
});


const Tour = model('Tour', tourSchema);
export default Tour;
