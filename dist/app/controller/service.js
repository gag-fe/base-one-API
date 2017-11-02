'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var underscore = require('underscore');
var node_ssh = require('node-ssh');
var SSH = new node_ssh();
var field = ['id', 'ip', 'name', 'account', 'pkey', 'ssh_key', 'port', 'service_tag', 'service_tag_text', 'service_tag', 'updated_at', 'remark', 'status'];
module.exports = function (app) {
    var HomeController = function (_app$Controller) {
        _inherits(HomeController, _app$Controller);

        function HomeController() {
            _classCallCheck(this, HomeController);

            return _possibleConstructorReturn(this, (HomeController.__proto__ || Object.getPrototypeOf(HomeController)).apply(this, arguments));
        }

        _createClass(HomeController, [{
            key: 'list',

            // 列表
            value: /*#__PURE__*/regeneratorRuntime.mark(function list(ctx) {
                var user_id, result;
                return regeneratorRuntime.wrap(function list$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user_id = ctx.query.user_id;

                                if (!(user_id == undefined)) {
                                    _context.next = 4;
                                    break;
                                }

                                this.error('参数有误', 200);
                                return _context.abrupt('return');

                            case 4:
                                _context.next = 6;
                                return ctx.app.knex('service').where({ user_id: user_id, status: 1 }).select(field);

                            case 6:
                                result = _context.sent;
                                //.limit(pageSize-1).offset(start-1);
                                if (result.length) {
                                    this.success(result);
                                } else {
                                    this.error('没有查询到相关数据', 200);
                                }

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, list, this);
            })
            // 通过服务器id 查询该条数据

        }, {
            key: 'service_by_id',
            value: /*#__PURE__*/regeneratorRuntime.mark(function service_by_id(ctx) {
                var user_id, service_id, result;
                return regeneratorRuntime.wrap(function service_by_id$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                user_id = ctx.query.user_id;
                                service_id = ctx.query.service_id;

                                if (!(!user_id || !service_id)) {
                                    _context2.next = 5;
                                    break;
                                }

                                this.error('参数有误', 200);
                                return _context2.abrupt('return');

                            case 5:
                                _context2.next = 7;
                                return ctx.app.knex('service').select(field).where({
                                    id: service_id,
                                    user_id: user_id
                                });

                            case 7:
                                result = _context2.sent;

                                if (result.length) {
                                    this.success(result[0]);
                                } else {
                                    this.error('没有查到相关数据');
                                }

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, service_by_id, this);
            })
            // 操作

        }, {
            key: 'operate',
            value: /*#__PURE__*/regeneratorRuntime.mark(function operate(ctx) {
                var _this2 = this;

                var body, service_tag_text_obj, queryField, config, id, port, remark, status, check_resulr, result, getId;
                return regeneratorRuntime.wrap(function operate$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                body = ctx.request.body;
                                service_tag_text_obj = {
                                    test: '测试服务器',
                                    official: '正式服务器'
                                };
                                queryField = ['user_id', 'name', 'ip', 'account', 'pkey', 'ssh_key'];
                                config = {};

                                queryField.map(function (key) {
                                    if (!body[key]) {
                                        _this2.error(key + ' \u53C2\u6570\u4E0D\u80FD\u4E3A\u7A7A');
                                        return;
                                    } else {
                                        config[key] = body[key];
                                    }
                                });
                                id = body.id;
                                port = body.port || 80;

                                config.port = port;
                                remark = body.remark || '';

                                config.remark = remark;
                                status = body.status || 0;

                                config.status = status;
                                config['service_tag'] = body.service_tag || 'test';
                                config['service_tag_text'] = service_tag_text_obj[config['service_tag']] || '测试服务器';
                                _context3.next = 16;
                                return this.checkService(config);

                            case 16:
                                check_resulr = _context3.sent;

                                if (check_resulr.status) {
                                    _context3.next = 20;
                                    break;
                                }

                                this.error({
                                    error: check_resulr.error
                                }, 200);
                                return _context3.abrupt('return');

                            case 20:
                                result = void 0;
                                // 添加或者更新服务器

                                if (!id) {
                                    _context3.next = 31;
                                    break;
                                }

                                config.id = id;
                                config.updated_at = new Date();
                                _context3.next = 26;
                                return this.app.knex('service').update(config).where({
                                    id: id
                                });

                            case 26:
                                _context3.next = 28;
                                return this.app.knex('service').where({
                                    id: id,
                                    status: 1
                                });

                            case 28:
                                result = _context3.sent;
                                _context3.next = 40;
                                break;

                            case 31:
                                // 添加服务器
                                config.created_at = new Date();
                                config.updated_at = new Date();
                                config.status = 1;
                                _context3.next = 36;
                                return this.app.knex('service').insert(config);

                            case 36:
                                getId = _context3.sent;
                                _context3.next = 39;
                                return this.app.knex('service').select(field).where({
                                    id: getId[0],
                                    status: 1
                                });

                            case 39:
                                result = _context3.sent;

                            case 40:
                                if (status === 0) {
                                    ctx.body = {
                                        status: 'S',
                                        msg: '数据删除成功',
                                        data: []
                                    };
                                }
                                this.success(result[0]);

                            case 42:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, operate, this);
            })
            // 检查服务器是否可用

        }, {
            key: 'checkService',
            value: /*#__PURE__*/regeneratorRuntime.mark(function checkService(config) {
                var LoginService, outPut, result;
                return regeneratorRuntime.wrap(function checkService$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                LoginService = new Promise(function (resolve, reject) {
                                    SSH.connect({
                                        host: config.ip,
                                        username: config.account,
                                        privateKey: config.ssh_key
                                    }).then(function (res) {
                                        resolve({
                                            msg: '登录成功',
                                            status: true
                                        });
                                    }).catch(function (err) {
                                        reject({
                                            msg: '登录失败',
                                            status: false,
                                            error: String(err)
                                        });
                                    });
                                });
                                outPut = void 0;
                                _context4.next = 4;
                                return LoginService.then(function (res) {
                                    outPut = res;
                                }).catch(function (res) {
                                    outPut = res;
                                });

                            case 4:
                                result = _context4.sent;
                                return _context4.abrupt('return', outPut);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, checkService, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=service.js.map