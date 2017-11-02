'use strict';

/**
 *  两个数组之间 求交集
 * */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Array.intersect = function () {
    var result = [];
    var obj = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
            var str = arguments[i][j];
            if (!obj[str]) {
                obj[str] = 1;
            } else {
                obj[str]++;
                if (obj[str] === arguments.length) {
                    result.push(str);
                }
            }
        }
    }
    return result;
};
/**
 *  数据之间 求差集
 *
 * */
Array.prototype.minus = function (arr) {
    var result = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = 1;
    }
    for (var j = 0; j < this.length; j++) {
        if (!obj[this[j]]) {
            obj[this[j]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};

module.exports = function (app) {
    app.baseUrl = 'http://git.gag.cn/api/v3';

    var CustomController = function (_app$Controller) {
        _inherits(CustomController, _app$Controller);

        function CustomController() {
            _classCallCheck(this, CustomController);

            return _possibleConstructorReturn(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).apply(this, arguments));
        }

        _createClass(CustomController, [{
            key: 'success',
            value: function success(data) {
                this.ctx.body = {
                    msg: '操作成功',
                    status: 'S',
                    data: data,
                    status_code: 200
                };
            }
        }, {
            key: 'error',
            value: function error(message, status) {
                status = status || 200;
                if (typeof message == 'string') {
                    this.ctx.body = {
                        msg: message,
                        status_code: status,
                        status: 'F'
                    };
                } else {
                    this.ctx.body = Object.assign({}, {
                        status_code: status,
                        status: 'F'
                    }, message);
                }
            }
        }, {
            key: 'notFound',
            value: function notFound(msg) {
                msg = msg || 'not found';
                this.ctx.throw(404, msg);
            }
        }, {
            key: 'check_private_token',
            value: function check_private_token() {
                var private_token = this.ctx.request.header.private_token;
                if (private_token == undefined) {
                    this.ctx.throw(403, '没有权限');
                }
            }
        }, {
            key: 'gitlab_result',
            value: function gitlab_result(result) {
                if (result.status < 300) {
                    this.success(result.data);
                } else {
                    var msg = result.data.message || '操作失败';
                    this.error(msg, result.status);
                }
            }
        }, {
            key: 'delpoyFalie',
            value: function delpoyFalie(deploy_status, description) {
                this.ctx.body = {
                    data: {
                        deploy_status: deploy_status,
                        description: description
                    },
                    status: "F",
                    message: "部署失败",
                    status_code: 200
                };
                this.ctx.status = 200;
            }
        }, {
            key: 'delpoySuccess',
            value: function delpoySuccess(deploy_status, description) {
                this.ctx.body = {
                    data: {
                        deploy_status: deploy_status,
                        description: description
                    },
                    status: "S",
                    message: "部署成功",
                    status_code: 200
                };
                this.ctx.status = 200;
            }
        }, {
            key: 'getPackageJSON',
            value: /*#__PURE__*/regeneratorRuntime.mark(function getPackageJSON() {
                var result;
                return regeneratorRuntime.wrap(function getPackageJSON$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.ctx.curl('http://git.gag.cn/FE_BFK/webhook-test/raw/master/package.json?private_token=XfuKh_TqjqRt-KaZgyXc', {
                                    dataType: 'json'
                                });

                            case 2:
                                result = _context.sent;
                                return _context.abrupt('return', result);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, getPackageJSON, this);
            })
            /**
             * 插入 webhook_service_deploy
             * @param user_id int user id 号
             * @param project_id int 项目 id
             * @param webhook_id webhook 项目 id
             * @param isInit 是否初始化
             * @param serviceIds 需要 部署的服务 ID 号
             * */

        }, {
            key: 'inset_service_deploy',
            value: /*#__PURE__*/regeneratorRuntime.mark(function inset_service_deploy(user_id, project_id, webhook_id, serviceIds, isInit) {
                var serviceIdsArr, del_service_ids, instart_service_ids, commmon_service_ids, insertArr, current_service_ids, serviceConfig, current_service_info, result;
                return regeneratorRuntime.wrap(function inset_service_deploy$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                serviceIdsArr = serviceIds || [];
                                del_service_ids = []; // 需要删除的 服务器 部署信息

                                instart_service_ids = []; // 需要插入的 服务器 部署信息

                                commmon_service_ids = [];
                                insertArr = [];
                                current_service_ids = []; //当前项目服务id

                                serviceConfig = {
                                    deploy_status: 0,
                                    deploy_status_text: '尚未部署',
                                    updated_at: new Date(),
                                    created_at: new Date(),
                                    user_id: user_id,
                                    project_id: project_id,
                                    webhook_id: webhook_id
                                };

                                if (!isInit) {
                                    _context2.next = 15;
                                    break;
                                }

                                _context2.next = 10;
                                return this.app.knex('webhook_service_deploy').where({
                                    user_id: user_id,
                                    project_id: project_id,
                                    webhook_id: webhook_id
                                }).del();

                            case 10:
                                serviceIds.map(function (id_key) {
                                    insertArr.push(Object.assign({}, serviceConfig, {
                                        service_id: id_key
                                    }));
                                });

                                if (!insertArr.length) {
                                    _context2.next = 14;
                                    break;
                                }

                                _context2.next = 14;
                                return this.app.knex('webhook_service_deploy').insert(insertArr);

                            case 14:
                                return _context2.abrupt('return', true);

                            case 15:
                                _context2.next = 17;
                                return this.app.knex('webhook_service_deploy').where({
                                    user_id: user_id,
                                    project_id: project_id,
                                    webhook_id: webhook_id
                                });

                            case 17:
                                current_service_info = _context2.sent;


                                /*
                                *  以 current 为主线
                                *  current.length === 0  // 全部插入
                                *  current.length !== 0
                                * */
                                current_service_info.map(function (webhookService) {
                                    current_service_ids.push(webhookService.service_id);
                                });
                                // 求 服务集合的并集
                                commmon_service_ids = Array.intersect(serviceIdsArr, current_service_ids);
                                // 需要插入的 service ids
                                instart_service_ids = serviceIdsArr.minus(commmon_service_ids);
                                // 需要删除的 service ids
                                del_service_ids = current_service_ids.minus(commmon_service_ids);
                                // 先删除

                                if (!del_service_ids.length) {
                                    _context2.next = 32;
                                    break;
                                }

                                _context2.prev = 23;
                                _context2.next = 26;
                                return this.app.knex('webhook_service_deploy').where({
                                    user_id: user_id,
                                    project_id: project_id,
                                    webhook_id: webhook_id
                                }).whereIn('service_id', del_service_ids).del();

                            case 26:
                                result = _context2.sent;
                                _context2.next = 32;
                                break;

                            case 29:
                                _context2.prev = 29;
                                _context2.t0 = _context2['catch'](23);
                                return _context2.abrupt('return', false);

                            case 32:
                                if (!instart_service_ids.length) {
                                    _context2.next = 37;
                                    break;
                                }

                                instart_service_ids.map(function (id_key) {
                                    insertArr.push(Object.assign({}, serviceConfig, {
                                        service_id: id_key
                                    }));
                                });

                                if (!insertArr.length) {
                                    _context2.next = 37;
                                    break;
                                }

                                _context2.next = 37;
                                return this.app.knex('webhook_service_deploy').insert(insertArr);

                            case 37:
                                return _context2.abrupt('return', true);

                            case 38:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, inset_service_deploy, this, [[23, 29]]);
            })
        }]);

        return CustomController;
    }(app.Controller);

    app.Controller = CustomController;
};
//# sourceMappingURL=app.js.map