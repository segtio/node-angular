import express from 'express';
import * as  validate from '../validators/auth.validate';
import * as  AuthController from '../controllers/auth';
import trimRequest from 'trim-request';

import passport from 'passport';
import '../../config/passport';


const router = express.Router();
const requireAuth = passport.authenticate('jwt', {
  session: false,
});

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post(
  '/register',
  trimRequest.all,
  validate.register,
  AuthController.register,
);

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validate.verify, AuthController.verify);

/*
 * Forgot password route
 */
router.post(
  '/forgot',
  trimRequest.all,
  validate.forgotPassword,
  AuthController.forgotPassword,
);

/*
 * Reset password route
 */
router.post(
  '/reset',
  trimRequest.all,
  validate.resetPassword,
  AuthController.resetPassword,
);
/*
 * update password route
 */
router.put(
  '/password/update',
  requireAuth,
  trimRequest.all,
  validate.resetPassword,
  AuthController.updatePassword,
);

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  AuthController.getRefreshToken,
);

/*
 * Login route
 */
router.post('/login', trimRequest.all, validate.login, AuthController.login);

export default router;
