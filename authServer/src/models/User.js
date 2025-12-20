import mongoose from 'mongoose';
import { generateToken } from '../utils/jwt.js';
import validator  from 'validator'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validator(value) {
        if (validator.isEmpty(value)) {
          throw new Error('firstName is requierd.');
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validator(value) {
        if (validator.isEmpty(value)) {
          throw new Error('lastName is requierd.');
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ['MALE', 'FEMALE', 'OTHER'],
        message: `{VALUE} is not gender type`,
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address' + value);
        }
        if (validator.isEmpty(value)) {
          throw new Error('email is requierd.');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 5,
    },
    age: {
      type: Number,
      required: true,
      min: [18, 'User must be {value} +'],
      max: 90,
    },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1, lastName: 1 }); //createing indexing

userSchema.methods.getJWT = function () {
  // const user = this;
  // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: '1h',
  // });
  return generateToken({ _id: this._id.toString() });
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

export default mongoose.model('User', userSchema);
