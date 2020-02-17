import '../env';
import fs from 'fs';
import initMongo from '../config/mongo';
import { removeExtensionFromFile } from '../api/middlewares/utils';
import path from "path";

const modelsPath = `../api/models`;

initMongo();

// Loop models path and loads every file as a model except index file
const models = fs
  .readdirSync(path.resolve(__dirname, modelsPath))
  .filter(file => removeExtensionFromFile(file) !== 'index');

const deleteModelFromDB = model =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line global-require,no-param-reassign
    model = require(`${modelsPath}/${model}`);
    model.deleteMany({}, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

const clean = async () => {
  try {
    const promiseArray = models.map(
      // eslint-disable-next-line no-return-await
      async model => await deleteModelFromDB(model),
    );

    await Promise.all(promiseArray);
    console.log('Cleanup complete!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

clean();
