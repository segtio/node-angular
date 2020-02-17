import {getAllQuizz} from '../services/quizzService';
import * as utils from '../middlewares/utils';
import Quizz from '../models/quizz';

/**
 * Get all quizz.
 *
 * @param {Object} req
 * @param {Object} res
 */
export const fetchAll = async (req, res) => {
  getAllQuizz()
    .then(data => res.json({data}))
    .catch(err => utils.handleError(res, err));
};

