import requestIp from 'request-ip';
import { validationResult as validationResultExpress } from 'express-validator/check';

/**
 * Removes extension from file.
 *
 * @param {string} file - Filename.
 */
export const removeExtensionFromFile = file =>
  file
    .split('.')
    .slice(0, -1)
    .join('.')
    .toString();

/**
 * Gets IP from user.
 *
 * @param {*} req - Request object.
 */
export const getIP = req => requestIp.getClientIp(req);

/**
 * Gets browser info from user.
 *
 * @param {*} req - Request object.
 */
export const getBrowserInfo = req => req.headers['user-agent'];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'.
 *
 * @param {*} req - Request object.
 */
export const getCountry = req =>
  req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX';

/**
 * Handles error by printing to console in development env and builds and sends an error response.
 *
 * @param {Object} res - Response object.
 * @param {Object} err - Error object.
 */
export const handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      code: err.code,
      message: err.message,
    },
  });
};

/**
 * Builds error object.
 *
 * @param {number} code - Error code.
 * @param {string} message - Error text.
 */
export const buildErrObject = (code, message) => ({
  code,
  message,
});

/**
 * Builds error for validation files.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Object} next - Next object.
 */
export const validationResult = (req, res, next) => {
  try {
    validationResultExpress(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    
return next();
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()));
  }
};

/**
 * Builds success object.
 *
 * @param {string} message - Success text.
 */
export const buildSuccObject = message => ({
  message: message,
});

/**
 * Checks if given ID is good for MongoDB.
 *
 * @param {string} id - Id to check.
 */
export const isIDGood = async id =>
  new Promise((resolve, reject) => {
    const goodID = String(id).match(/^[0-9a-fA-F]{24}$/);

    
return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, 'ID_MALFORMED'));
  });

/**
 * Item not found.
 *
 * @param {Object} err - Error object.
 * @param {Object} item - Item result object.
 * @param {Object} reject - Reject object.
 * @param {string} message - Message.
 */
export const itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (!item) {
    reject(this.buildErrObject(404, message));
  }
};

/**
 * Item already exists.
 *
 * @param {Object} err - Error object.
 * @param {Object} item - Item result object.
 * @param {Object} reject - Reject object.
 * @param {string} message - Message.
 */
export const itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (item) {
    reject(this.buildErrObject(422, message));
  }
};
