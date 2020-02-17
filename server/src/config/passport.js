import passport from 'passport';
import User from '../api/models/user';
import {Strategy as JwtStrategy} from 'passport-jwt';
import * as auth from '../api/middlewares/auth';


/**
 * Extracts token from: header, body or query.
 *
 * @param {Object} req - Request object.
 * @returns {string} Token - decrypted token.
 */
const jwtExtractor = req => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token);
  }
  
return token;
};

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    
return !user ? done(null, false) : done(null, user);
  });
});

passport.use(jwtLogin);
