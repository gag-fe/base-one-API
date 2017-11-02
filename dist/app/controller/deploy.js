'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shell = require('shelljs');
var SimmpleGit = require('simple-git');
var _ = require('underscore');

var fs = require('fs');
var path = require('path');
var node_ssh = require('node-ssh');
var SSH = new node_ssh();
var Git = SimmpleGit();
var deployStatusText = {
    '-1': '没有查询到该项目package.json webhook配置项',
    '100': '部署失败',
    "200": 'git clone项目失败',
    "201": 'git pull项目失败',
    '300': '登录服务器失败',
    "400": '本地代码克隆岛远程失败',
    '500': '服务器部署成功',
    '505': '服务器部署失败',
    '600': '未知错误'
};
module.exports = function (app) {
    var DeployController = function (_app$Controller) {
        _inherits(DeployController, _app$Controller);

        function DeployController() {
            _classCallCheck(this, DeployController);

            return _possibleConstructorReturn(this, (DeployController.__proto__ || Object.getPrototypeOf(DeployController)).apply(this, arguments));
        }

        _createClass(DeployController, [{
            key: 'tag_push',

            /**
             * 项目部署 tag_push
             *  逻辑要求
             *  1、新tag_push 的项目；入库项目的 user_id，user_name，user_email，project_id，project_name，ssh_url，description，description
             *
             * */
            value: /*#__PURE__*/regeneratorRuntime.mark(function tag_push(ctx) {
                var event, repo, ref, project, webhook_id, tag, projectArr, config, result;
                return regeneratorRuntime.wrap(function tag_push$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                event = ctx.request.body.event_name;
                                repo = ctx.request.body;
                                ref = ctx.request.body.ref || '';
                                project = ctx.request.body.project;
                                webhook_id = '';

                                if (!(event !== 'tag_push' || ref.indexOf('publish') === -1)) {
                                    _context.next = 8;
                                    break;
                                }

                                this.error('没有部署', 402);
                                return _context.abrupt('return');

                            case 8:
                                tag = _.last(repo.ref.split('/')).split('#')[1] || 'v1.0.0';
                                _context.next = 11;
                                return this.app.knex('webhook').where({
                                    project_id: repo.project_id
                                });

                            case 11:
                                projectArr = _context.sent;
                                config = {
                                    user_id: repo.user_id,
                                    user_name: repo.user_email.split('@')[0],
                                    user_email: repo.user_email,
                                    project_id: repo.project_id,
                                    project_name: project.name,
                                    ssh_url: project.ssh_url,
                                    web_url: project.web_url,
                                    description: project.description,
                                    git_tags: tag,
                                    status: 1,
                                    deploy_status: 0,
                                    deploy_status_text: '尚未部署',
                                    updated_at: new Date()
                                };

                                if (!projectArr.length) {
                                    _context.next = 19;
                                    break;
                                }

                                webhook_id = projectArr[0].id;
                                _context.next = 17;
                                return this.app.knex('webhook').update(config).where({
                                    project_id: repo.project_id,
                                    user_id: repo.user_id
                                });

                            case 17:
                                _context.next = 24;
                                break;

                            case 19:
                                config.created_at = new Date();
                                _context.next = 22;
                                return this.app.knex('webhook').insert(config);

                            case 22:
                                result = _context.sent;

                                webhook_id = result[0];

                            case 24:
                                if (!webhook_id) {
                                    _context.next = 27;
                                    break;
                                }

                                _context.next = 27;
                                return this.inset_service_deploy(repo.user_id, repo.project_id, webhook_id, [], true);

                            case 27:
                                this.success({ data: 1 });

                            case 28:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, tag_push, this);
            })
        }]);

        return DeployController;
    }(app.Controller);

    return DeployController;
};
//# sourceMappingURL=deploy.js.map