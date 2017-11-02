'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var underscore = require('underscore');
module.exports = function (app) {
    var HomeController = function (_app$Controller) {
        _inherits(HomeController, _app$Controller);

        function HomeController() {
            _classCallCheck(this, HomeController);

            return _possibleConstructorReturn(this, (HomeController.__proto__ || Object.getPrototypeOf(HomeController)).apply(this, arguments));
        }

        _createClass(HomeController, [{
            key: 'get_project',

            // 查找项目
            value: /*#__PURE__*/regeneratorRuntime.mark(function get_project(ctx) {
                var private_token, query, page, pageSize, result, data;
                return regeneratorRuntime.wrap(function get_project$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context.next = 4;
                                    break;
                                }

                                this.error({
                                    message: '401 Unauthorized'
                                }, 401);
                                return _context.abrupt('return');

                            case 4:
                                query = ctx.query;
                                page = query.page || 1;
                                pageSize = query.pageSize || 20;

                                if (page <= 0 || pageSize <= 0) {
                                    this.error('参数有误', 400);
                                }
                                query = underscore.pairs(query);
                                query = query.filter(function (value) {
                                    return value[0] !== 'page' && value[0] !== 'pageSize';
                                }).map(function (value) {
                                    return value.join('=');
                                });
                                query = query.join('&');
                                if (query) {
                                    query = '&' + query;
                                }
                                _context.next = 14;
                                return ctx.curl(this.app.baseUrl + '/projects?private_token=' + private_token + query, {
                                    dataType: 'json'
                                });

                            case 14:
                                result = _context.sent;

                                if (result.status < 300) {
                                    data = result.data;

                                    data = {
                                        data: data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
                                        size: data.length
                                    };
                                    this.success(data);
                                } else {
                                    this.error(result.data.message, result.status);
                                }

                            case 16:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, get_project, this);
            })
        }, {
            key: 'get__projects_owned',
            value: /*#__PURE__*/regeneratorRuntime.mark(function get__projects_owned(ctx) {
                var private_token, query, page, pageSize, result, data;
                return regeneratorRuntime.wrap(function get__projects_owned$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context2.next = 4;
                                    break;
                                }

                                this.error('401 Unauthorized', 401);
                                return _context2.abrupt('return');

                            case 4:
                                query = ctx.query;
                                page = query.page || 1;
                                pageSize = query.pageSize || 10;

                                if (page <= 0 || pageSize <= 0) {
                                    this.error('参数有误', 400);
                                }
                                query = underscore.pairs(query);
                                query = query.map(function (value) {
                                    return value.join('=');
                                });
                                query = query.join('&');
                                if (query) {
                                    query = '&' + query;
                                }
                                _context2.next = 14;
                                return ctx.curl(this.app.baseUrl + '/projects/owned?private_token=' + private_token + query, {
                                    dataType: 'json'
                                });

                            case 14:
                                result = _context2.sent;

                                if (result.status < 300) {
                                    data = result.data;

                                    data = {
                                        data: data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
                                        size: data.length
                                    };
                                    this.success(data);
                                } else {
                                    this.error(result.data.message, result.status);
                                }

                            case 16:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, get__projects_owned, this);
            })
            // 查询某项目

        }, {
            key: 'search_project',
            value: /*#__PURE__*/regeneratorRuntime.mark(function search_project(ctx) {
                var private_token, id, result;
                return regeneratorRuntime.wrap(function search_project$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context3.next = 4;
                                    break;
                                }

                                this.error('401 Unauthorized', 401);
                                return _context3.abrupt('return');

                            case 4:
                                id = ctx.query.id;

                                if (!(underscore.isNull(id) || underscore.isUndefined(id))) {
                                    _context3.next = 8;
                                    break;
                                }

                                this.error('参数有误', 400);
                                return _context3.abrupt('return');

                            case 8:
                                _context3.next = 10;
                                return ctx.curl(this.app.baseUrl + '/projects/' + id + '?private_token=' + private_token, {
                                    dataType: 'json'
                                });

                            case 10:
                                result = _context3.sent;

                                this.gitlab_result(result);

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, search_project, this);
            })
            // 查询某项目 tags

        }, {
            key: 'search_peoject_tags',
            value: /*#__PURE__*/regeneratorRuntime.mark(function search_peoject_tags(ctx) {
                var private_token, id, tag_name, result;
                return regeneratorRuntime.wrap(function search_peoject_tags$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context4.next = 4;
                                    break;
                                }

                                this.error('401 Unauthorized', 401);
                                return _context4.abrupt('return');

                            case 4:
                                id = ctx.query.id;
                                tag_name = ctx.query.tag_name || '';

                                if (tag_name) {
                                    tag_name = '/' + tag_name;
                                }

                                if (!(underscore.isNull(id) || underscore.isUndefined(id) || underscore.isNull(tag_name) || underscore.isUndefined(tag_name))) {
                                    _context4.next = 10;
                                    break;
                                }

                                this.error('参数有误', 400);
                                return _context4.abrupt('return');

                            case 10:
                                _context4.next = 12;
                                return ctx.curl(this.app.baseUrl + '/projects/' + id + '/repository/tags' + tag_name + '?private_token=' + private_token, {
                                    dataType: 'json'
                                });

                            case 12:
                                result = _context4.sent;

                                this.gitlab_result(result);

                            case 14:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, search_peoject_tags, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=projects.js.map