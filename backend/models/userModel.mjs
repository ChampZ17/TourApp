import { randomBytes, createHash } from 'node:crypto';
import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [20, 'A name must have less than 21 characters!!!'],
    minlength: [5, 'A name must have more than 4 characters!!!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!!!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!!!'],
    uniqueCaseInsensitive: true,
  },
  photo: {
    type: String,
    default() {
      return `https://i.pravatar.cc/150?u=${this.email}`;
    },
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'trn-admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!!!'],
    minlength: [8, 'A password must have more than 7 characters!!!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please comfirm a password!!!'],
    validate: {
      validator(element) {
        return element === this.password;
      },
      message: 'Passwords are not the same!!!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.plugin(uniqueValidator, {
  message: '💥 Error, {VALUE} is already taken!!! 💥',
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 13);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function (next) {

  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.toAuthJSON = function () {
  return {
    name: this.name,
    email: this.email,
    photo: this.photo,
    role: this.role,
  };
};

userSchema.methods.comparePassword = async (
  candidatePassword,
  userPassword,
) => {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

userSchema.methods.changedPasswordAfterToken = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString('hex');

  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model('User', userSchema);
export default User;
