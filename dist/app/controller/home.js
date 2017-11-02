'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (app) {
    var HomeController = function (_app$Controller) {
        _inherits(HomeController, _app$Controller);

        function HomeController() {
            _classCallCheck(this, HomeController);

            return _possibleConstructorReturn(this, (HomeController.__proto__ || Object.getPrototypeOf(HomeController)).apply(this, arguments));
        }

        _createClass(HomeController, [{
            key: 'index',
            value: /*#__PURE__*/regeneratorRuntime.mark(function index(ctx) {
                return regeneratorRuntime.wrap(function index$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return ctx.render('index');

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, index, this);
            })
        }, {
            key: 'get',
            value: /*#__PURE__*/regeneratorRuntime.mark(function get(ctx) {
                var result;
                return regeneratorRuntime.wrap(function get$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return ctx.app.curl('http://git.gag.cn/api/v3/projects?private_token=XfuKh_TqjqRt-KaZgyXc&username=yaojiasong', {
                                    dataType: 'json'
                                });

                            case 2:
                                result = _context2.sent;

                                // console.log(result.data);
                                // ctx.body = result;
                                this.success(result.data);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, get, this);
            })
        }, {
            key: 'post',
            value: /*#__PURE__*/regeneratorRuntime.mark(function post(ctx) {
                var result;
                return regeneratorRuntime.wrap(function post$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return ctx.app.curl('http://git.gag.cn/api/v3/session', {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: {
                                        login: 'yaojiasong',
                                        password: 'Yao921305',
                                        email: 'yaojiasong@gooagoo.com'
                                    }
                                });

                            case 2:
                                result = _context3.sent;


                                ctx.body = result;

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, post, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=home.js.map