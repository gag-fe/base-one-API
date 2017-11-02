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
            key: 'get_all_groups',

            // 获取 所有 grounds
            value: /*#__PURE__*/regeneratorRuntime.mark(function get_all_groups(ctx) {
                var private_token, result;
                return regeneratorRuntime.wrap(function get_all_groups$(_context) {
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
                                _context.next = 6;
                                return ctx.curl(this.app.baseUrl + '/groups?private_token=' + private_token, {
                                    dataType: 'json'
                                });

                            case 6:
                                result = _context.sent;

                                this.gitlab_result(result);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, get_all_groups, this);
            })
            // 查询某项目组下 项目

        }, {
            key: 'search_groups_by_id',
            value: /*#__PURE__*/regeneratorRuntime.mark(function search_groups_by_id(ctx) {
                var private_token, query, page, pageSize, id, result, data;
                return regeneratorRuntime.wrap(function search_groups_by_id$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context2.next = 4;
                                    break;
                                }

                                this.error({
                                    message: '401 Unauthorized'
                                }, 401);
                                return _context2.abrupt('return');

                            case 4:
                                query = ctx.query;
                                page = query.page || 1;
                                pageSize = query.pageSize || 20;
                                id = query.id;

                                if (!(id == undefined)) {
                                    _context2.next = 11;
                                    break;
                                }

                                this.error({
                                    message: '参数有误'
                                }, 400);
                                return _context2.abrupt('return');

                            case 11:
                                query = underscore.pairs(query);
                                query = query.filter(function (value) {
                                    return value[0] !== 'page' && value[0] !== 'pageSize' && value[0] !== 'id';
                                }).map(function (value) {
                                    return value.join('=');
                                });
                                query = query.join('&');
                                if (query) {
                                    query = '&' + query;
                                }
                                _context2.next = 17;
                                return ctx.curl(this.app.baseUrl + '/groups/' + id + '/projects?private_token=' + private_token + query, {
                                    dataType: 'json'
                                });

                            case 17:
                                result = _context2.sent;

                                if (result.status < 300) {
                                    data = result.data;

                                    data = {
                                        data: data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
                                        size: data.length
                                    };
                                    this.success(data);
                                } else {
                                    this.error(result.data, result.status);
                                }

                            case 19:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, search_groups_by_id, this);
            })
        }, {
            key: 'groups_details_by_id',
            value: /*#__PURE__*/regeneratorRuntime.mark(function groups_details_by_id(ctx) {
                var private_token, query, id, result;
                return regeneratorRuntime.wrap(function groups_details_by_id$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                private_token = ctx.query.token;

                                if (!(private_token == undefined)) {
                                    _context3.next = 4;
                                    break;
                                }

                                this.error({
                                    message: '401 Unauthorized'
                                }, 401);
                                return _context3.abrupt('return');

                            case 4:
                                query = ctx.query;
                                id = query.id;

                                if (!(id == undefined)) {
                                    _context3.next = 9;
                                    break;
                                }

                                this.error({
                                    message: '参数有误'
                                }, 400);
                                return _context3.abrupt('return');

                            case 9:
                                _context3.next = 11;
                                return ctx.curl(this.app.baseUrl + '/groups/' + id + '?private_token=' + private_token, {
                                    dataType: 'json'
                                });

                            case 11:
                                result = _context3.sent;

                                this.gitlab_result(result);

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, groups_details_by_id, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=groups.js.map