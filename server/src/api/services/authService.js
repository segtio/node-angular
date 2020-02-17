import jwt from 'jsonwebtoken';
import uuid  from 'uuid';
import { addHours } from 'date-fns';
import User from '../models/user';
import UserAccess from '../models/userAccess';
import ForgotPassword from '../models/forgotPassword';
import * as utils from '../middlewares/utils';

const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;

/**
 * Generates a token.
 *
 * @param {Object} user - User object.
 */
const generateToken = user => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES;

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: user,
        },
        exp: expiration,
      },
      process.env.JWT_SECRET,
    ),
  );
};

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK.
 *
 * @param {Object} user - User object.
 */
const blockUser = async user =>
  new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK);
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(utils.buildErrObject(409, 'BLOCKED_USER'));
      }
    });
  });

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now.
 *
 * @param {Object} user - User object.
 */
const blockIsExpired = user =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date();

/**
 * Creates an object with user info.
 *
 * @param {Object} req - Request object.
 */
exports.setUserInfo = req => {
  let user = {
    _id: req._id,
    firstName: req.firstName,
    lastName: req.lastName,
    phone: req.phone,
    city: req.city,
    country: req.country,
    email: req.email,
    role: req.role,
    verified: req.verified,
  };

  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== 'production') {
    user = {
      ...user,
      verification: req.verification,
    };
  }
  
return user;
};

/**
 * Saves a new user access and then returns token.
 *
 * @param {Object} req - Request object.
 * @param {Object} user - User object.
 */
exports.saveUserAccessAndReturnToken = async (req, user) =>
  new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req),
    });

    userAccess.save(err => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      const userInfo = setUserInfo(user);

      // Returns data with access token
      resolve({
        token: generateToken(user._id),
        user: userInfo,
      });
    });
  });


/**
 * Saves login attempts to dabatabse.
 *
 * @param {Object} user - User object.
 */
exports.saveLoginAttemptsToDB = async user =>
  new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(true);
      }
    });
  });

/**
 *
 * @param {Object} user - User object.
 */
exports.checkLoginAttemptsAndBlockExpires = async user =>
  new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0;
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message));
        }
        if (result) {
          resolve(true);
        }
      });
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true);
    }
  });

/**
 * Checks if blockExpires from user is greater than now.
 *
 * @param {Object} user - User object.
 */
exports.userIsBlocked = async user =>
  new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(utils.buildErrObject(409, 'BLOCKED_USER'));
    }
    resolve(true);
  });

/**
 * Finds user by email.
 *
 * @param {string} email - User´s email.
 */
exports.findUser = async email =>
  new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      'password loginAttempts blockExpires name email role verified verification firstName lastName phone city country',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST');
        resolve(item);
      },
    );
  });

/**
 * Finds user by ID.
 *
 * @param {string} id - User´s id.
 */
exports.findUserById = async userId =>
  new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST');
      resolve(item);
    });
  });

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function.
 *
 * @param {Object} user - User object.
 */
exports.passwordsDoNotMatch = async user => {
  user.loginAttempts += 1;
  await saveLoginAttemptsToDB(user);
  
return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'));
    } else {
      resolve(blockUser(user));
    }
    reject(utils.buildErrObject(422, 'ERROR'));
  });
};

/**
 * Registers a new user in database.
 *
 * @param {Object} req - Request object.
 */
exports.registerUser = async req =>
  new Promise((resolve, reject) => {
    const user = new User({
      firstName: req.firstName,
      lastName: req.lastName,
      phone: req.phone,
      city: req.city,
      country: req.country,
      email: req.email,
      password: req.password,
      verification: uuid.v4(),
    });

    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(item);
    });
  });

/**
 * Builds the registration token.
 *
 * @param {Object} item - User object that contains created id.
 * @param {Object} userInfo - User object.
 */
exports.returnRegisterToken = (item, userInfo) => {
  if (process.env.NODE_ENV !== 'production') {
    userInfo.verification = item.verification;
  }
  const data = {
    token: generateToken(item._id),
    user: userInfo,
  };

  
return data;
};

/**
 * Checks if verification id exists for user.
 *
 * @param {string} id - Verification id.
 */
exports.verificationExists = async id =>
  new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false,
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND_OR_ALREADY_VERIFIED');
        resolve(user);
      },
    );
  });

/**
 * Verifies an user.
 *
 * @param {Object} user - User object.
 */
exports.verifyUser = async user =>
  new Promise((resolve, reject) => {
    user.verified = true;
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve({
        email: item.email,
        verified: item.verified,
      });
    });
  });

/**
 * Marks a request to reset password as used.
 *
 * @param {Object} req - Request object.
 * @param {Object} forgot - Forgot object.
 */
exports.markResetPasswordAsUsed = async (req, forgot) =>
  new Promise((resolve, reject) => {
    forgot.used = true;
    forgot.ipChanged = utils.getIP(req);
    forgot.browserChanged = utils.getBrowserInfo(req);
    forgot.countryChanged = utils.getCountry(req);
    forgot.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND');
      resolve(utils.buildSuccObject('PASSWORD_CHANGED'));
    });
  });

/**
 * Updates a user password in database.
 *
 * @param {string} password - New password.
 * @param {Object} user - User object.
 */
exports.updatePassword = async (password, user) =>
  new Promise((resolve, reject) => {
    user.password = password;
    user.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND');
      resolve(item);
    });
  });

/**
 * Finds user by email to reset password.
 *
 * @param {string} email - User email.
 */
exports.findUserToResetPassword = async email =>
  new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND');
        resolve(user);
      },
    );
  });

/**
 * Checks if a forgot password verification exists.
 *
 * @param {string} id - Verification id.
 */
exports.findForgotPassword = async id =>
  new Promise((resolve, reject) => {
    ForgotPassword.findOne(
      {
        verification: id,
        used: false,
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'NOT_FOUND_OR_ALREADY_USED');
        resolve(item);
      },
    );
  });

/**
 * Creates a new password forgot.
 *
 * @param {Object} req - Request object.
 */
exports.saveForgotPassword = async req =>
  new Promise((resolve, reject) => {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuid.v4(),
      ipRequest: utils.getIP(req),
      browserRequest: utils.getBrowserInfo(req),
      countryRequest: utils.getCountry(req),
    });

    forgot.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(item);
    });
  });

/**
 * Builds an object with created forgot password object, if env is development or testing exposes the verification.
 *
 * @param {Object} item - Created forgot password object.
 */
exports.forgotPasswordResponse = item => {
  let data = {
    msg: 'RESET_EMAIL_SENT',
    email: item.email,
  };

  if (process.env.NODE_ENV !== 'production') {
    data = {
      ...data,
      verification: item.verification,
    };
  }
  
return data;
};

/**
 * Checks against user if has quested role.
 *
 * @param {Object} data - Data object.
 * @param {*} next - Next callback.
 */
exports.checkPermissions = async (data, next) =>
  new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      utils.itemNotFound(err, result, reject, 'NOT_FOUND');
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next());
      }
      
return reject(utils.buildErrObject(401, 'UNAUTHORIZED'));
    });
  });

/**
 * Gets user id from token.
 *
 * @param {string} token - Encrypted and encoded token.
 */
exports.getUserIdFromToken = async token =>
  new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, 'BAD_TOKEN'));
      }
      resolve(decoded.data._id);
    });
  });
