'use strict';

var _require = require('egg-mock/bootstrap'),
    app = _require.app,
    assert = _require.assert;

describe('test/app1/controller/home.test.js', function () {

  it('should assert', /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var pkg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pkg = require('../../../package.json');

            assert(app.config.keys.startsWith(pkg.name));

            // const ctx = app1.mockContext({});
            // yield ctx.service.xx();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  it('should GET /', function () {
    return app.httpRequest().get('/').expect('hi, egg').expect(200);
  });
});
//# sourceMappingURL=home.test.js.map