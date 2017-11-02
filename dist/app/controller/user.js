'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var underscore = require('underscore');
module.exports = function (app) {
    var UserController = function (_app$Controller) {
        _inherits(UserController, _app$Controller);

        function UserController() {
            _classCallCheck(this, UserController);

            return _possibleConstructorReturn(this, (UserController.__proto__ || Object.getPrototypeOf(UserController)).apply(this, arguments));
        }

        _createClass(UserController, [{
            key: 'get_user',


            // 获取用户
            value: /*#__PURE__*/regeneratorRuntime.mark(function get_user(ctx) {
                var id, userId, private_token, result;
                return regeneratorRuntime.wrap(function get_user$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                id = ctx.query.id;
                                userId = '';

                                if (id != undefined) {
                                    userId = '/' + id;
                                }
                                private_token = ctx.request.header.token;
                                _context.next = 6;
                                return ctx.app.curl(this.app.baseUrl + '/users' + userId + '?private_token=' + private_token, {
                                    dataType: 'json'
                                });

                            case 6:
                                result = _context.sent;


                                if (result.status < 300) {
                                    this.success(result.data);
                                } else {
                                    this.error(result.data, result.status);
                                }

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, get_user, this);
            })
            // 检查用户token 是否可用

        }, {
            key: 'check_user_token',
            value: /*#__PURE__*/regeneratorRuntime.mark(function check_user_token(ctx) {
                var private_token, field, output, user_info, result;
                return regeneratorRuntime.wrap(function check_user_token$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(!private_token || private_token == undefined)) {
                                    _context2.next = 4;
                                    break;
                                }

                                this.error('\u53C2\u6570\u6709\u8BEF: token\u4E3A' + private_token);
                                return _context2.abrupt('return');

                            case 4:
                                field = ['id', 'username', 'email', 'name', 'avatar_url', 'token', 'remark', 'update_at'];
                                output = {};
                                _context2.next = 8;
                                return ctx.app.knex('user').where({ token: private_token });

                            case 8:
                                user_info = _context2.sent;

                                if (user_info.length) {
                                    _context2.next = 12;
                                    break;
                                }

                                this.error('授权失败');
                                return _context2.abrupt('return');

                            case 12:
                                _context2.next = 14;
                                return ctx.app.curl(this.app.baseUrl + '/users?private_token=' + private_token);

                            case 14:
                                result = _context2.sent;


                                if (user_info.length && result.status < 300) {
                                    field.map(function (key) {
                                        output[key] = user_info[0][key];
                                    });
                                    this.success(output);
                                } else {
                                    this.error('授权失败', 401);
                                }

                            case 16:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, check_user_token, this);
            })
        }]);

        return UserController;
    }(app.Controller);

    return UserController;
};
//# sourceMappingURL=user.js.map