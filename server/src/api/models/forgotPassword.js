import mongoose from 'mongoose';
import  validator from 'validator';

const modelName = 'ForgotPassword';
const collectionName = modelName.toLowerCase();

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID',
      },
      lowercase: true,
      required: true,
    },
    verification: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
    ipRequest: {
      type: String,
    },
    browserRequest: {
      type: String,
    },
    countryRequest: {
      type: String,
    },
    ipChanged: {
      type: String,
    },
    browserChanged: {
      type: String,
    },
    countryChanged: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model(modelName, ForgotPasswordSchema, collectionName);
