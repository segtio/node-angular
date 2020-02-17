import * as authService from '../services/authService';
import { matchedData } from 'express-validator/filter';
import * as utils from '../middlewares/utils';
import * as auth from '../middlewares/auth';
import * as emailer from '../middlewares/emailer';

/**
 * Login function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const login = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await authService.findUser(data.email);

    await authService.userIsBlocked(user);
    await authService.checkLoginAttemptsAndBlockExpires(user);
    const isPasswordMatch = await auth.checkPassword(data.password, user);

    if (!isPasswordMatch) {
      utils.handleError(res, await authService.passwordsDoNotMatch(user));
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0;
      await authService.saveLoginAttemptsToDB(user);
      res.status(200).json(await authService.saveUserAccessAndReturnToken(req, user));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Register function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();

    req = matchedData(req);
    const doesEmailExists = await emailer.emailExists(req.email);

    if (!doesEmailExists) {
      const item = await authService.registerUser(req);
      const userInfo = authService.setUserInfo(item);
      const response = authService.returnRegisterToken(item, userInfo);

      emailer.sendRegistrationEmailMessage(locale, item);
      res.status(201).json(response);
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Verify function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const verify = async (req, res) => {
  try {
    req = matchedData(req);
    const user = await authService.verificationExists(req.id);

    res.status(200).json(await authService.verifyUser(user));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Forgot password function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    const data = matchedData(req);

    await findUser(data.email);
    const item = await authService.saveForgotPassword(req);

    emailer.sendResetPasswordEmailMessage(locale, item);
    res.status(200).json(authService.forgotPasswordResponse(item));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Reset password function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const resetPassword = async (req, res) => {
  try {
    const data = matchedData(req);
    const forgotPassword = await authService.findForgotPassword(data.id);
    const user = await authService.findUserToResetPassword(forgotPassword.email);

    await authService.updatePassword(data.password, user);
    const result = await authService.markResetPasswordAsUsed(req, forgotPassword);

    res.status(200).json(result);
  } catch (error) {
    utils.handleError(res, error);
  }
};
/**
 * Reset password function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const updatePassword = async (req, res) => {
  try {
    const data = matchedData(req);
    const user = await authService.findUserById(data.id);

    await authService.updatePassword(data.password, user);
    res.status(200).json(utils.buildSuccObject('PASSWORD_CHANGED'));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Refresh token function called by route.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 */
export const getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim();
    let userId = await authService.getUserIdFromToken(tokenEncrypted);

    userId = await utils.isIDGood(userId);
    const user = await authService.findUserById(userId);
    const token = await authService.saveUserAccessAndReturnToken(req, user);

    // Removes user info from response
    delete token.user;
    res.status(200).json(token);
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Roles authorization function called by route.
 *
 * @param {Array} roles - Roles specified on the route.
 */
export const roleAuthorization = roles => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles,
    };

    await authService.checkPermissions(data, next);
  } catch (error) {
    utils.handleError(res, error);
  }
};
