import crypto from 'crypto';
const algorithm = 'aes-256-ecb';
const secret = process.env.JWT_SECRET;

module.exports = {
  /**
   * Checks is password matches.
   *
   * @param {string} password - Password.
   * @param {Object} user - User object.
   * @returns {boolean}
   */
  async checkPassword(password, user) {
    return new Promise((resolve, reject) => {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          reject(this.buildErrObject(422, err.message));
        }
        if (!isMatch) {
          resolve(false);
        }
        resolve(true);
      });
    });
  },

  /**
   * Encrypts text.
   *
   * @param {string} text - Text to encrypt.
   */
  encrypt(text) {
    const cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');
    
return crypted;
  },

  /**
   * Decrypts text.
   *
   * @param {string} text - Text to decrypt.
   */
  decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, secret);

    try {
      let dec = decipher.update(text, 'hex', 'utf8');

      dec += decipher.final('utf8');
      
return dec;
    } catch (err) {
      return err;
    }
  },
};
