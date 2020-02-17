import nodemailer from 'nodemailer';
import mg  from 'nodemailer-mailgun-transport';
import User from '../models/user';
import { itemAlreadyExists } from '../middlewares/utils';

/**
 * Sends email.
 *
 * @param {Object} data - Data.
 * @param {boolean} callback - Callback.
 */
const sendEmail = async (data, callback) => {
  const auth = {
    auth: {
      // eslint-disable-next-line camelcase
      api_key: process.env.EMAIL_SMTP_API_MAILGUN,
      domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN,
    },
  };
  const transporter = nodemailer.createTransport(mg(auth));
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.firstName}${data.user.lastName} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage,
  };

  transporter.sendMail(mailOptions, err => {
    if (err) {
      return callback(false);
    }
    
return callback(true);
  });
};

/**
 * Prepares to send email.
 *
 * @param {string} user - User object.
 * @param {string} subject - Subject.
 * @param {string} htmlMessage - Html message.
 */
const prepareToSendEmail = (user, subject, htmlMessage) => {
  // eslint-disable-next-line no-param-reassign
  user = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    verification: user.verification,
  };
  const data = {
    user,
    subject,
    htmlMessage,
  };

  if (process.env.NODE_ENV === 'production') {
    sendEmail(data, messageSent =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`),
    );
  } else if (process.env.NODE_ENV === 'development') {
    console.log(data);
  }
};

module.exports = {
  /**
   * Checks User model if user with an specific email exists.
   *
   * @param {string} email - User email.
   */
  async emailExists(email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS');
          resolve(false);
        },
      );
    });
  },

  /**
   * Checks User model if user with an specific email exists but excluding user id.
   *
   * @param {string} id - User id.
   * @param {string} email - User email.
   */
  async emailExistsExcludingMyself(id, email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
          _id: {
            $ne: id,
          },
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS');
          resolve(false);
        },
      );
    });
  },

  /**
   * Sends registration email.
   *
   * @param {string} locale - Locale.
   * @param {Object} user - User object.
   */
  async sendRegistrationEmailMessage(locale, user) {
    i18n.setLocale(locale);
    const subject = i18n.__('registration.SUBJECT');
    const htmlMessage = i18n.__(
      'registration.MESSAGE',
      user.firstName,
      user.lastName,
      process.env.FRONTEND_URL,
      user.verification,
    );

    prepareToSendEmail(user, subject, htmlMessage);
  },

  /**
   * Sends reset password email.
   *
   * @param {string} locale - Locale.
   * @param {Object} user - User object.
   */
  async sendResetPasswordEmailMessage(locale, user) {
    i18n.setLocale(locale);
    // eslint-disable-next-line no-underscore-dangle
    const subject = i18n.__('forgotPassword.SUBJECT');
    // eslint-disable-next-line no-underscore-dangle
    const htmlMessage = i18n.__(
      'forgotPassword.MESSAGE',
      user.email,
      process.env.FRONTEND_URL,
      user.verification,
    );

    prepareToSendEmail(user, subject, htmlMessage);
  },
};
