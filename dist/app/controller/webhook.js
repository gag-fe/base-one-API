'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var underscore = require('underscore');
var shell = require('shelljs');
var SimmpleGit = require('simple-git');
var path = require('path');
var node_ssh = require('node-ssh');
var SSH = new node_ssh();
// 服务器列表字段
var serverField = ['id', 'account', 'pkey', 'ip', 'ssh_key', 'port', 'service_tag_text', 'service_tag', 'updated_at', 'remark', 'status'];
// webhook 列表字段
var webhookField = ['id', 'user_id', 'user_name', 'project_id', 'project_name', 'web_url', 'ssh_url', 'git_tags', 'service_ids', 'deploy_status_text', 'deploy_status', 'status', 'updated_at', 'remark'];
var deployStatusText = {
    '-1': '没有查询到该项目package.json webhook配置项',
    '0': '尚未部署',
    '100': '部署失败',
    "200": 'git clone项目失败',
    "201": 'git pull项目失败',
    "202": 'git 代码下载失败',
    '300': '登录服务器失败',
    "400": '本地代码克隆岛远程失败',
    '500': '服务器部署成功',
    '505': '服务器部署失败',
    '600': '未知错误'
};
var webhook_deploy_field = ['webhook_id', 'project_id', 'user_id', 'deploy_status', 'deploy_status_text'];
module.exports = function (app) {
    var HomeController = function (_app$Controller) {
        _inherits(HomeController, _app$Controller);

        function HomeController() {
            _classCallCheck(this, HomeController);

            return _possibleConstructorReturn(this, (HomeController.__proto__ || Object.getPrototypeOf(HomeController)).apply(this, arguments));
        }

        _createClass(HomeController, [{
            key: 'list',

            // 查询 webhook 列表
            value: /*#__PURE__*/regeneratorRuntime.mark(function list(ctx) {
                var user_id, result, size, i, serviceId;
                return regeneratorRuntime.wrap(function list$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user_id = ctx.query.user_id;
                                // const page = ctx.query.page || 1;
                                // const pageSize = ctx.query.pageSize || 20;
                                // if (user_id == undefined) {
                                //     this.error('参数有误');
                                //     return;
                                // }

                                _context.next = 3;
                                return ctx.app.knex('webhook').select(webhookField).where({
                                    status: 1,
                                    user_id: user_id
                                });

                            case 3:
                                result = _context.sent;
                                size = result.length;
                                //result = result.splice((page-1) * pageSize , pageSize);

                                i = 0;

                            case 6:
                                if (!(i < result.length)) {
                                    _context.next = 19;
                                    break;
                                }

                                if (!result[i].service_ids) {
                                    _context.next = 14;
                                    break;
                                }

                                serviceId = result[i].service_ids.split(',');
                                _context.next = 11;
                                return this.app.knex('service').select(serverField).whereIn('id', serviceId).where({
                                    user_id: user_id,
                                    status: 1
                                });

                            case 11:
                                result[i].service = _context.sent;
                                _context.next = 16;
                                break;

                            case 14:
                                result[i].service_id = undefined;
                                result[i].service = [];

                            case 16:
                                i++;
                                _context.next = 6;
                                break;

                            case 19:
                                if (result.length) {
                                    this.success(result);
                                } else {
                                    this.error('没有查询到相关数据', 200);
                                }

                            case 20:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, list, this);
            })
            // 更新或者删除 webhook 项目

        }, {
            key: 'operate',
            value: /*#__PURE__*/regeneratorRuntime.mark(function operate(ctx) {
                var body, user_id, project_id, webhook_id, service_ids, serviceIds, status, remark, config, result;
                return regeneratorRuntime.wrap(function operate$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                body = ctx.request.body;
                                user_id = ctx.request.body.user_id;
                                project_id = ctx.request.body.project_id;
                                // 插入数据

                                webhook_id = body.id;
                                service_ids = body.service_ids || '';
                                serviceIds = [];

                                if (service_ids) {
                                    serviceIds = service_ids.split(',');
                                };
                                status = body.status ? 1 : 0;
                                remark = body.remark;
                                config = {};

                                if (!(webhook_id == undefined || !user_id)) {
                                    _context2.next = 14;
                                    break;
                                }

                                this.error('参数有误', 200);
                                return _context2.abrupt('return');

                            case 14:
                                config.updated_at = new Date();
                                config.status = status;

                                if (service_ids != undefined) {
                                    config.service_ids = service_ids;
                                }
                                if (remark != undefined) {
                                    config.remark = remark;
                                }
                                _context2.next = 20;
                                return ctx.app.knex('webhook').update(config).where({
                                    id: webhook_id
                                });

                            case 20:
                                _context2.next = 22;
                                return ctx.app.knex('webhook').select(webhookField).where({
                                    id: webhook_id
                                });

                            case 22:
                                result = _context2.sent;
                                _context2.next = 25;
                                return this.inset_service_deploy(user_id, project_id, webhook_id, serviceIds);

                            case 25:
                                result = result[0];

                                if (!result) {
                                    _context2.next = 34;
                                    break;
                                }

                                if (!serviceIds.length) {
                                    _context2.next = 31;
                                    break;
                                }

                                _context2.next = 30;
                                return ctx.app.knex('service').select(serverField).whereIn('id', serviceIds).where({
                                    user_id: user_id,
                                    status: 1
                                });

                            case 30:
                                result.service = _context2.sent;

                            case 31:
                                this.success(result);
                                _context2.next = 35;
                                break;

                            case 34:
                                this.error('添加失败');

                            case 35:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, operate, this);
            })
        }, {
            key: 'deploy',
            value: /*#__PURE__*/regeneratorRuntime.mark(function deploy(ctx) {
                var id, token, service_id, webhookResult, serviceArr, projectInfo, webhookConfigResult, gitProject, deployProject;
                return regeneratorRuntime.wrap(function deploy$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                //
                                console.time('部署总用时');
                                id = ctx.query.id; // webhook id

                                token = ctx.query.token; // token

                                service_id = ctx.query.service_id; // 对应服务器 id

                                if (!(!id || !token || !service_id)) {
                                    _context3.next = 7;
                                    break;
                                }

                                this.error('参数有误', 200);
                                return _context3.abrupt('return');

                            case 7:
                                _context3.next = 9;
                                return this.app.knex('webhook').where({
                                    id: id
                                });

                            case 9:
                                webhookResult = _context3.sent;
                                _context3.next = 12;
                                return this.app.knex('service').where('id', service_id);

                            case 12:
                                serviceArr = _context3.sent;

                                if (!(!webhookResult.length || !serviceArr.length)) {
                                    _context3.next = 16;
                                    break;
                                }

                                this.error('没有查询到项目以及服务器配置信息');
                                return _context3.abrupt('return');

                            case 16:
                                // webhook 配置项
                                projectInfo = webhookResult[0];
                                // 添加 服务器id

                                projectInfo.service_id = service_id;
                                /**
                                 * 环节一 查询 package.json 配置项 是否完整
                                 *  method check_package_json
                                 * */
                                _context3.next = 20;
                                return this.check_package_json(projectInfo, token);

                            case 20:
                                webhookConfigResult = _context3.sent;

                                if (webhookConfigResult) {
                                    _context3.next = 24;
                                    break;
                                }

                                this.error('package.json 配置不完整');
                                return _context3.abrupt('return');

                            case 24:
                                /**
                                * 环节二 将远程代码 克隆到 webhook 项目本地
                                 *
                                * */
                                console.time('git');
                                _context3.next = 27;
                                return this.git_clone_to_local(projectInfo);

                            case 27:
                                gitProject = _context3.sent;

                                if (gitProject) {
                                    _context3.next = 31;
                                    break;
                                }

                                this.error('git 命令执行失败 ');
                                return _context3.abrupt('return');

                            case 31:
                                console.timeEnd('git');
                                /**
                                 * 环节四  查询配置服务器
                                 * 登录远程服务器
                                 *  更加 项目的package.json webhhok配置 分部署代码
                                 * */
                                console.time('部署服务器');
                                _context3.next = 35;
                                return this.deploy_project_to_service(serviceArr[0], Object.assign({}, gitProject, webhookConfigResult.data.webhook, projectInfo));

                            case 35:
                                deployProject = _context3.sent;
                                _context3.next = 38;
                                return this.save_deploy_log(projectInfo, deployProject);

                            case 38:
                                console.timeEnd('部署服务器');
                                console.timeEnd('部署总用时');
                                if (deployProject.status) {
                                    this.success({
                                        failed_file: deployProject.failed_file,
                                        successful_file: deployProject.successful_file
                                    });
                                } else {
                                    this.error(deployProject);
                                }

                            case 41:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, deploy, this);
            })
            /**
             * 查询配置服务器 并配置服务器 并将 build 文件克隆到远程主机
             *
             * */

        }, {
            key: 'deploy_project_to_service',
            value: /*#__PURE__*/regeneratorRuntime.mark(function deploy_project_to_service(serviceObj, webhookConfigObj) {
                var failed, successful, deployPrpmise, deployProject;
                return regeneratorRuntime.wrap(function deploy_project_to_service$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                failed = [], successful = [];
                                deployPrpmise = new Promise(function (resolve, reject) {
                                    SSH.connect({
                                        host: serviceObj.ip,
                                        username: serviceObj.account,
                                        privateKey: serviceObj.ssh_key
                                    }).then(function () {
                                        console.log('=========>>服务器登录成功');
                                        SSH.putDirectory(webhookConfigObj.shell_pwd_stdout + '/' + webhookConfigObj.project_name + webhookConfigObj.build_path, '' + webhookConfigObj.remote_deploy_path, {
                                            recursive: true,
                                            concurrency: 100,
                                            validate: function validate(itemPath) {
                                                var baseName = path.basename(itemPath);
                                                return baseName.substr(0, 1) !== '.' && // do not allow dot files
                                                baseName !== 'node_modules'; // do not allow node_modules
                                            },
                                            tick: function tick(localPath, remotePath, error) {
                                                if (error) {
                                                    failed.push(localPath);
                                                } else {
                                                    successful.push(localPath);
                                                }
                                            }
                                        }).then(function (status) {
                                            console.log('=========>>目标文件部署', status ? '完成' : '失败');
                                            console.log('=========>>文件部署失败', failed.join(' ||=|| '));
                                            console.log('=========>>文件部署成功', successful.join(' ||=|| '));
                                            resolve({
                                                status_code: 500,
                                                msg: '\u90E8\u7F72\u6210\u529F ',
                                                status: true,
                                                failed_file: failed.join('##'),
                                                successful_file: successful.join(',')
                                            });
                                        }).catch(function (err) {
                                            console.log('=========>>服务器部署 失败 ', err.toString());
                                            reject({
                                                status_code: 100,
                                                status: false,
                                                msg: '\u90E8\u7F72\u5931\u8D25 error: ' + err.toString()
                                            });
                                        });
                                    }).catch(function (err) {
                                        console.log('=========>>服务器登录 失败 ', err.toString());
                                        reject({
                                            status_code: 300,
                                            status: false,
                                            err: err.toString(),
                                            msg: '登录失败'
                                        });
                                    });
                                });
                                _context4.next = 4;
                                return deployPrpmise.then(function (res) {
                                    return res;
                                }).catch(function (err) {
                                    return {
                                        status_code: 100,
                                        status: false,
                                        error: err.toString()
                                    };
                                });

                            case 4:
                                deployProject = _context4.sent;
                                return _context4.abrupt('return', deployProject);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, deploy_project_to_service, this);
            })

            /**
             *   git clone 远程代码 克隆到本地
             *   定义 项目存储的本地位置
             *   cd 项目存储的文件夹下 并获取当前目录绝对路径 赋值给 变量 shell_pwd_stdout
             *   查询当前目录是否有该项目 如果有 git pull 没有 git clone
             *   定义项目 拉取和clone permise 函数
             *   git pull
             *     cd 到 项目所在目录 pull
             *   git clone
             *     创建以项目名称命名的文件夹
             *
             * */

        }, {
            key: 'git_clone_to_local',
            value: /*#__PURE__*/regeneratorRuntime.mark(function git_clone_to_local(projectInfo) {
                var webhook_local_path, shell_pwd_stdout, shell_code_project_name, gitPromise, gitP;
                return regeneratorRuntime.wrap(function git_clone_to_local$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                // 本地存储项目的位置
                                webhook_local_path = '/home/hewenshan/yaojiasong/webhook-git'; //'/Users/yaojiasong/gooagoo/project/node';//
                                // cd 存储项目

                                shell.cd(webhook_local_path);
                                shell_pwd_stdout = shell.pwd().stdout;
                                shell_code_project_name = shell.find(projectInfo.project_name).code;
                                gitPromise = new Promise(function (resolve, reject) {
                                    if (shell_code_project_name == 0) {
                                        // git pull
                                        console.log('=========>>git pull 开始');
                                        var Git = SimmpleGit(webhook_local_path + '/' + projectInfo.project_name);
                                        Git.pull(function (err) {
                                            if (err) {
                                                console.log('=========>>git pull \u5931\u8D25 ' + err.toString());
                                                reject({
                                                    status: false,
                                                    status_code: 201,
                                                    msg: 'git pull ' + projectInfo.ssh_url + ' error: ' + err.toString() + ' \u62C9\u53D6\u5931\u8D25',
                                                    err: err.toString()
                                                });
                                            } else {
                                                console.log('=========>>git pull 成功');
                                                resolve({
                                                    status: true,
                                                    msg: 'git pull 拉取成功'
                                                });
                                            }
                                        });
                                    } else {
                                        var _Git = SimmpleGit(); // 克隆文件
                                        console.log('=========>>git clone 开始');
                                        shell.mkdir(projectInfo.project_name);
                                        setTimeout(function () {}, 100);
                                        _Git.clone(projectInfo.ssh_url, shell_pwd_stdout + '/' + projectInfo.project_name, function (err, dir) {
                                            if (err) {
                                                console.log('=========>>git clone \u5931\u8D25 ' + err.toString());
                                                reject({
                                                    status: false,
                                                    status_code: 200,
                                                    msg: ' git clone  ' + projectInfo.ssh_url + ' error:' + err.toString() + ' \u514B\u9686\u5931\u8D25'
                                                });
                                            } else {
                                                console.log('=========>>git clone 成功');
                                                resolve({
                                                    status: true,
                                                    msg: '克隆成功'
                                                });
                                            }
                                        });
                                    }
                                });
                                _context5.next = 7;
                                return gitPromise.then(function (res) {
                                    return res;
                                }).catch(function (err) {
                                    return {
                                        error: err.toString(),
                                        status_code: 100,
                                        status: false
                                    };
                                });

                            case 7:
                                gitP = _context5.sent;

                                if (gitP.status) {
                                    _context5.next = 12;
                                    break;
                                }

                                _context5.next = 11;
                                return this.save_deploy_log(projectInfo, gitP);

                            case 11:
                                return _context5.abrupt('return', false);

                            case 12:
                                return _context5.abrupt('return', {
                                    GitMsg: gitP,
                                    webhook_local_path: webhook_local_path,
                                    shell_pwd_stdout: shell_pwd_stdout
                                });

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, git_clone_to_local, this);
            })

            /**
             * 查询 package.json 配置项 是否完整
             * */

        }, {
            key: 'check_package_json',
            value: /*#__PURE__*/regeneratorRuntime.mark(function check_package_json(projectInfo, token) {
                var webhookConfigResult, webhookConfig;
                return regeneratorRuntime.wrap(function check_package_json$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.app.curl(projectInfo.web_url + '/raw/master/package.json?private_token=' + token, {
                                    dataType: 'json'
                                });

                            case 2:
                                webhookConfigResult = _context6.sent;

                                if (webhookConfigResult.data) {
                                    _context6.next = 7;
                                    break;
                                }

                                _context6.next = 6;
                                return this.save_deploy_log(Object.assign(projectInfo), {
                                    status_code: -1,
                                    description: '没有获取到package.json信息'
                                });

                            case 6:
                                return _context6.abrupt('return', false);

                            case 7:
                                // 获取package.json 配置 webhook
                                webhookConfig = webhookConfigResult.data.webhook;

                                // 环节二 查询配置项 查询配置项 是否完整

                                if (!(!webhookConfig || !webhookConfig.build_path || !webhookConfig.remote_deploy_path)) {
                                    _context6.next = 12;
                                    break;
                                }

                                _context6.next = 11;
                                return this.save_deploy_log(projectInfo, {
                                    status_code: -1,
                                    description: '该项目没有配置或者配置不完整'
                                });

                            case 11:
                                return _context6.abrupt('return', false);

                            case 12:
                                return _context6.abrupt('return', webhookConfigResult);

                            case 13:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, check_package_json, this);
            })
        }, {
            key: 'save_deploy_log',
            value: /*#__PURE__*/regeneratorRuntime.mark(function save_deploy_log(projectInfo, deployInfo, git_url) {
                var deployStatusText, config, webhook_deploy_config, webhookConfig;
                return regeneratorRuntime.wrap(function save_deploy_log$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                deployStatusText = {
                                    '-1': '没有查询到该项目package.json webhook配置项',
                                    '0': '尚未部署',
                                    '100': '部署失败',
                                    "200": 'git clone项目失败',
                                    "201": 'git pull项目失败',
                                    '300': '登录服务器失败',
                                    "400": '本地代码克隆岛远程失败',
                                    '500': '服务器部署成功',
                                    '505': '服务器部署失败',
                                    '600': '未知错误'
                                };
                                config = {
                                    project_id: projectInfo.project_id,
                                    project_name: projectInfo.project_name,
                                    user_id: projectInfo.user_id,
                                    user_name: projectInfo.user_name,
                                    ssh_url: projectInfo.ssh_url,
                                    web_url: projectInfo.web_url,
                                    service_id: projectInfo.service_id,
                                    git_tags: projectInfo.git_tags,
                                    remark: deployInfo.description || deployInfo.msg,
                                    deploy_status: deployInfo.status_code,
                                    deploy_status_text: deployInfo.msg || deployStatusText[deployInfo.status_code] || '未知错误',
                                    created_at: new Date()
                                };

                                if (deployInfo.error) {
                                    config.error = deployInfo.error;
                                }
                                if (git_url) {
                                    config['git_back_ssh_url'] = git_url;
                                }
                                if (deployInfo.fail_file) {
                                    config.fail_file = deployInfo.fail_file;
                                }
                                if (deployInfo.err) {
                                    config.error = deployInfo.err;
                                }
                                if (deployInfo.success_file) {
                                    config.success_file = deployInfo.success_file;
                                }
                                if (deployInfo.service) {
                                    config.service_ip = deployInfo.service.ip;
                                    config.service_account = deployInfo.service.account;
                                }
                                _context7.next = 10;
                                return this.app.knex('webhook_deploy_log').insert(config);

                            case 10:
                                webhook_deploy_config = {
                                    deploy_status: deployInfo.status_code,
                                    deploy_status_text: deployInfo.msg || deployStatusText[deployInfo.status_code] || '未知错误'
                                };
                                _context7.prev = 11;
                                _context7.next = 14;
                                return this.app.knex('webhook_service_deploy').update(webhook_deploy_config).where({
                                    project_id: projectInfo.project_id,
                                    user_id: projectInfo.user_id,
                                    webhook_id: projectInfo.id,
                                    service_id: projectInfo.service_id
                                });

                            case 14:
                                _context7.next = 18;
                                break;

                            case 16:
                                _context7.prev = 16;
                                _context7.t0 = _context7['catch'](11);

                            case 18:
                                webhookConfig = {
                                    deploy_status: deployInfo.status_code || 0,
                                    deploy_status_text: deployStatusText[deployInfo.status_code] || '未知错误',
                                    updated_at: new Date()
                                };
                                _context7.next = 21;
                                return this.app.knex('webhook').update(webhookConfig).where({
                                    project_id: projectInfo.project_id,
                                    user_id: projectInfo.user_id
                                });

                            case 21:
                                if (deployInfo.status === 500) {
                                    this.delpoySuccess(deployInfo.status, deployInfo.description);
                                } else {
                                    this.success(deployInfo);
                                }

                            case 22:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, save_deploy_log, this, [[11, 16]]);
            })
        }, {
            key: 'deploy_log',
            value: /*#__PURE__*/regeneratorRuntime.mark(function deploy_log(ctx) {
                var queryField, output_field, query, queryConfig, i, result;
                return regeneratorRuntime.wrap(function deploy_log$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                queryField = ['project_id', 'user_id', 'webhook_id'];
                                output_field = ['deploy_status', 'deploy_status_text', 'service_id'];
                                query = ctx.query;
                                queryConfig = {};
                                i = 0;

                            case 5:
                                if (!(i < queryField.length)) {
                                    _context8.next = 13;
                                    break;
                                }

                                if (query[queryField[i]]) {
                                    _context8.next = 9;
                                    break;
                                }

                                this.error(queryField[i] + ' \u53C2\u6570\u4E3A\u7A7A');
                                return _context8.abrupt('return');

                            case 9:
                                queryConfig[queryField[i]] = query[queryField[i]];

                            case 10:
                                i++;
                                _context8.next = 5;
                                break;

                            case 13:
                                _context8.next = 15;
                                return ctx.app.knex('webhook_service_deploy').select(output_field).where(queryConfig);

                            case 15:
                                result = _context8.sent;

                                if (result[0]) {
                                    this.success(result);
                                } else {
                                    this.error('没有查询到该项目的配置信息，请重新配置项目');
                                }

                            case 17:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, deploy_log, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=webhook.js.map