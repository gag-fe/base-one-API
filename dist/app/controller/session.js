'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var underscore = require('underscore');
module.exports = function (app) {
    var SessionController = function (_app$Controller) {
        _inherits(SessionController, _app$Controller);

        function SessionController() {
            _classCallCheck(this, SessionController);

            return _possibleConstructorReturn(this, (SessionController.__proto__ || Object.getPrototypeOf(SessionController)).apply(this, arguments));
        }

        _createClass(SessionController, [{
            key: 'login',
            value: /*#__PURE__*/regeneratorRuntime.mark(function login(ctx) {
                var username, password, result, field, config, reData, userid, userResult, obj;
                return regeneratorRuntime.wrap(function login$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                username = ctx.request.body.username;
                                password = ctx.request.body.password;

                                if (!(!username || !password)) {
                                    _context.next = 5;
                                    break;
                                }

                                this.error('参数有误');
                                return _context.abrupt('return');

                            case 5:
                                // 切割邮箱
                                if (username.indexOf('@') !== -1) {
                                    username = username.split('@')[0];
                                }

                                _context.next = 8;
                                return ctx.curl('http://git.gag.cn/api/v3/session', {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: {
                                        login: username,
                                        password: password
                                    }
                                });

                            case 8:
                                result = _context.sent;
                                field = ['id', 'username', 'email', 'name', 'avatar_url'];
                                config = {};

                                if (!(result.status < 300)) {
                                    _context.next = 27;
                                    break;
                                }

                                reData = result.data;
                                userid = reData.id;
                                _context.next = 16;
                                return this.app.knex('user').where({ id: userid });

                            case 16:
                                userResult = _context.sent;

                                field.map(function (key) {
                                    config[key] = reData[key];
                                });
                                config['token'] = reData['private_token'];
                                config['update_at'] = new Date();

                                if (userResult.length) {
                                    _context.next = 24;
                                    break;
                                }

                                obj = {
                                    created_at: new Date(),
                                    status: 1,
                                    update_at: new Date(),
                                    password: password
                                };
                                // 插入新的数据

                                _context.next = 24;
                                return this.app.knex('user').insert(Object.assign({}, config, obj));

                            case 24:

                                this.success(config);
                                _context.next = 28;
                                break;

                            case 27:
                                this.error('401 Unauthorized', result.status);

                            case 28:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, login, this);
            })
        }]);

        return SessionController;
    }(app.Controller);

    return SessionController;
};
//# sourceMappingURL=session.js.map