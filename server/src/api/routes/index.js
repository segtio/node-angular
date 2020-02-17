import express from 'express';
import fs from 'fs';
import { removeExtensionFromFile } from '../middlewares/utils';
import swaggerSpec from "../../utils/swagger";
import * as utils from '../middlewares/utils';

const router = express.Router();
const routesPath = `${__dirname}/`;

const isDynamicImport = routeFile =>
  routeFile !== 'index' && routeFile !== 'auth';

/*
 * Load routes statically and/or dynamically
 */

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// Load Auth route
router.use('/', require('./auth'));

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter(file => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file);

  // Prevents loading of this file and auth file
  return isDynamicImport(routeFile)
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : '';
});

router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  });
});

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  utils.handleError(res, {
    code: 404,
    message: 'URL_NOT_FOUND',
  });
});

export default router;
