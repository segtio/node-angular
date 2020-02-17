import { expect } from 'chai';
import app from '../src/index';
import request from 'supertest';

describe('Base API Test', () => {
  it('should return API version and title for the app', done => {
    request(app)
      .get('/api')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.app).to.be.equal(app.locals.title);
        expect(res.body.apiVersion).to.be.equal(app.locals.version);

        done();
      });
  });

  it('should return 405 method not allowed for random API hits', done => {
    const randomString = Math.random()
      .toString(36)
      .substr(2, 5);

    request(app)
      .get(`/api/${randomString}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.errors.code).to.be.equal(404);
        expect(res.body.errors.message).to.be.equal('URL_NOT_FOUND');

        done();
      });
  });
});
