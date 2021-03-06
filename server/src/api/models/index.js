import fs from 'fs';
import { removeExtensionFromFile } from '../middlewares/utils';
const modelsPath = `${__dirname}/`;

module.exports = () => {
  /*
   * Load models dynamically
   */

  // Loop models path and loads every file as a model except this file
  fs.readdirSync(modelsPath).filter(file => {
    // Take filename and remove last part (extension)
    const modelFile = removeExtensionFromFile(file);

    // Prevents loading of this file
    return modelFile !== 'index' ? require(`./${modelFile}`) : '';
  });
};
