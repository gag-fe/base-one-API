'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app1/controller/home.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app1.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, egg')
      .expect(200);
  });
});
