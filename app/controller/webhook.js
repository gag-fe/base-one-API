'use strict';
const shell = require('shelljs');
const SimmpleGit = require('simple-git');
const path = require('path');
const node_ssh = require('node-ssh');
const SSH = new node_ssh();
// 服务器列表字段
// webhook 列表字段
const  webhookField = ['id','user_id','user_name','project_id','project_name','web_url','ssh_url','git_tags','service_ids','deploy_status_text','deploy_status','status','updated_at','remark'];

const webhook_deploy_field = ['webhook_id','project_id','user_id','deploy_status','deploy_status_text'];
module.exports = app => {
    class HomeController extends app.Controller {
        // 查询 webhook 列表
        *list(ctx) {
            let serverField = ['id','name','account','pkey','ip','ssh_key','port','service_tag_text','service_tag','updated_at','remark','status'];
            let user_id = ctx.query.user_id;
            // const page = ctx.query.page || 1;
            // const pageSize = ctx.query.pageSize || 20;
            // if (user_id == undefined) {
            //     this.error('参数有误');
            //     return;
            // }
            var result = yield ctx.app.knex('webhook').select(webhookField).where({
                status: 1,
                user_id: user_id
            });
            // const size = result.length;
            //result = result.splice((page-1) * pageSize , pageSize);
            for (var i = 0;i < result.length; i ++) {
                if (result[i].service_ids) {
                    let serviceId = result[i].service_ids.split(',');
                    result[i].service = yield this.app.knex('service')
                        .select(serverField)
                        .whereIn('id', serviceId)
                        .where({
                            user_id: user_id,
                            status: 1
                        });
                } else {
                    result[i].service_id = undefined;
                    result[i].service = []
                }
            }
            if (result.length) {
                this.success(result);
            } else {
                this.error('没有查询到相关数据',200)
            }
            user_id = null;
            result = null;
            serverField = null;
        }
        // 更新或者删除 webhook 项目
        *operate(ctx) {
            const body = ctx.request.body;
            const user_id = ctx.request.body.user_id;
            const project_id = ctx.request.body.project_id;
            // 插入数据
            var webhook_id = body.id;
            var service_ids = body.service_ids || '';
            let serviceIds = [];
            if (service_ids) {
                serviceIds = service_ids.split(',');
            };
            var status = body.status? 1 : 0;
            var remark = body.remark;
            var config = {};
            if (webhook_id == undefined || !user_id) {
                this.error('参数有误', 200);
                return;
            }
            config.updated_at = new Date();
            config.status = status;

            if (service_ids != undefined ) {
                config.service_ids = service_ids
            }
            if (remark != undefined) {
                config.remark = remark
            }
            yield ctx.app.knex('webhook').update(config).where({
                id: webhook_id
            });
            let result = yield ctx.app.knex('webhook').select(webhookField).where({
                id: webhook_id
            });
            yield this.inset_service_deploy(user_id,project_id,webhook_id,serviceIds);
            result = result[0];
            if (result) {
                if (serviceIds.length) {
                    result.service = yield ctx.app.knex('service')
                        .select(serverField)
                        .whereIn('id', serviceIds)
                        .where({
                            user_id: user_id,
                            status: 1
                        });
                }
                this.success(result);
            } else {
               this.error('添加失败');
            }
        }
        *deploy(ctx) { //
            console.time('部署总用时');
            const id = ctx.query.id; // webhook id
            const token = ctx.query.token; // token
            const service_id = ctx.query.service_id; // 对应服务器 id
            if (!id || !token || !service_id) {
                this.error('参数有误', 200);
                return;
            }

            const webhookResult = yield this.app.knex('webhook').where({
                id: id
            });
            let serviceArr = yield this.app.knex('service').where('id', service_id);
            if (!webhookResult.length || !serviceArr.length) {
                this.error('没有查询到项目以及服务器配置信息');
                return;
            }
            // webhook 配置项
            let projectInfo = webhookResult[0];
            // 添加 服务器id
            projectInfo.service_id = service_id;
            projectInfo.ip = serviceArr[0].ip;
            //
            /**
             * 环节一 查询 package.json 配置项 是否完整
             *  method check_package_json
             * */
            const webhookConfigResult = yield this.check_package_json(projectInfo, token);
            if (!webhookConfigResult.status) {
                this.error(webhookConfigResult.msg);
                return;
            }
            /**
            * 环节二 将远程代码 克隆到 webhook 项目本地
             *
            * */
            console.time('git');
            const gitProject = yield this.git_clone_to_local(projectInfo);

            if (!gitProject) {
                this.error('git 命令执行失败 ');
                return;
            }
            console.timeEnd('git');
            /**
             * 环节四  查询配置服务器
             * 登录远程服务器
             *  更加 项目的package.json webhhok配置 分部署代码
             * */
            console.time('部署服务器');
            let deployProject = yield this.deploy_project_to_service(serviceArr[0],Object.assign({},gitProject,webhookConfigResult.data.webhook,projectInfo));
            yield this.save_deploy_log(projectInfo,deployProject);
            console.timeEnd('部署服务器');
            console.timeEnd('部署总用时');
            if (deployProject.status) {
                this.success({
                    failed_file: deployProject.failed_file,
                    successful_file: deployProject.successful_file
                });
            } else {
                this.error({
                    msg: deployProject.error
                });
            }
            serviceArr = null; deployProject = null;
        }
        /**
         * 查询配置服务器 并配置服务器 并将 build 文件克隆到远程主机
         *
         * */
         *deploy_project_to_service(serviceObj, webhookConfigObj) {
            let failed = [], successful =[];
            const deployPrpmise = new Promise((resolve, reject) => {
                SSH.connect({
                    host: serviceObj.ip,
                    username: serviceObj.account,
                    privateKey: serviceObj.ssh_key
                }).then(() => {
                    console.log('=========>>服务器登录成功');
                    SSH.putDirectory(`${webhookConfigObj.shell_pwd_stdout}/${webhookConfigObj.project_name}${webhookConfigObj.build_path}`, `${webhookConfigObj[serviceObj.ip]}`,{
                        recursive: true,
                        concurrency: 100,
                        validate: function(itemPath) {
                            const baseName = path.basename(itemPath)
                            return baseName.substr(0, 1) !== '.' && // do not allow dot files
                                baseName !== 'node_modules' // do not allow node_modules
                        },
                        tick: function(localPath, remotePath, error) {
                            if (error) {
                                failed.push(localPath)
                            } else {
                                successful.push(localPath)
                            }
                        }
                    }).then((status) => {
                        console.log('=========>>目标文件部署', status ? '完成' : '失败');
                        console.log('=========>>文件部署失败', failed.join(' ||=|| '));
                        console.log('=========>>文件部署成功', successful.join(' ||=|| '));
                        resolve({
                            status_code: 500,
                            msg: `部署成功 `,
                            status: true,
                            failed_file:failed.join('##'),
                            successful_file: successful.join(',')
                        })
                    }).catch((err) => {
                        console.log('=========>>服务器部署 失败 ', err.toString());
                        if (err.toString() === 'Error: Failure') {
                            resolve({
                                status_code: 500,
                                status: true,
                                msg: '部署成功'
                            });
                        } else {
                            reject({
                                status_code: 100,
                                status: false,
                                error: `部署失败 error: ${err.toString()}`
                            });
                        }

                    })
                }).catch((err) => {
                    console.log('=========>>服务器登录 失败 ', err.toString());
                    console.log('失败',err);
                    let msg = '登录失败';
                    let status_code = 300;
                    if (err.status_code) {
                        status_code = err.status_code;
                        err = err.error;
                        msg = '部署失败';
                    }
                    reject({
                        status_code: status_code,
                        status: false,
                        error: `${msg}: ${err.toString()}`
                    });
                })
            });
            const deployProject = yield deployPrpmise.then(function(res) {
                return res;
            }).catch(function(err) {
                let code;
                let error;
                if (err.status_code) {
                    code = err.status_code;
                    error = err.error;
                }
                return {
                    status_code: code || 100,
                    status: false,
                    error: error || err
                }
            });
            console.log(deployProject);
            return deployProject;
        }

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
        *git_clone_to_local(projectInfo) {
            // 本地存储项目的位置
            const webhook_local_path =   '/home/hewenshan/yaojiasong/webhook-git'; //  '/Users/yaojiasong/gooagoo/project/node';//
            // cd 存储项目
            shell.cd(webhook_local_path);
            const shell_pwd_stdout = shell.pwd().stdout;
            const shell_code_project_name = shell.find(projectInfo.project_name).code;
            const gitPromise = new Promise((resolve, reject) => {
                if (shell_code_project_name == 0) { // git pull
                    console.log('=========>>git pull 开始');
                    let Git = SimmpleGit(`${webhook_local_path}/${projectInfo.project_name}`);
                    Git.pull(function(err) {
                        if (err) {
                            console.log(`=========>>git pull 失败 ${err.toString()}`);
                            reject({
                                status: false,
                                status_code: 201,
                                msg: `git pull ${projectInfo.ssh_url} error: ${err.toString()} 拉取失败`,
                                err:err.toString()
                            });
                        } else {
                            console.log('=========>>git pull 成功');
                            resolve({
                                status: true,
                                msg: 'git pull 拉取成功'
                            });
                        }

                    })
                } else {
                    let Git = SimmpleGit(); // 克隆文件
                    console.log('=========>>git clone 开始');
                    shell.mkdir(projectInfo.project_name);
                    setTimeout(function(){}, 100);
                     Git.clone(projectInfo.ssh_url, `${shell_pwd_stdout}/${projectInfo.project_name}`, function(err, dir) {
                        if(err) {
                            console.log(`=========>>git clone 失败 ${err.toString()}`);
                            reject({
                                status: false,
                                status_code: 200,
                                msg: ` git clone  ${projectInfo.ssh_url} error:${err.toString()} 克隆失败`
                            });
                        } else {
                            console.log('=========>>git clone 成功');
                            resolve({
                                status: true,
                                msg: '克隆成功'
                            });
                        }
                    })
                }
            });
            var gitP = yield gitPromise.then(function(res) {
                return res;
            }).catch(function(err){
                return {
                    error: err.toString(),
                    status_code: 100,
                    status: false
                };
            });

            if (!gitP.status) { // git 失败
                yield this.save_deploy_log(projectInfo, gitP);
                return false;
            }
            return {
                GitMsg:gitP,
                webhook_local_path: webhook_local_path,
                shell_pwd_stdout
            };
        }

        /**
         * 查询 package.json 配置项 是否完整
         * */

        *check_package_json(projectInfo, token) {
            const webhookConfigResult = yield this.app.curl(`${projectInfo.web_url}/raw/master/package.json?private_token=${token}`,{
                dataType: 'json'
            });
            // 环节一 查询项目package.json
            if (!webhookConfigResult.data) {
                let config = {
                    status_code:-1,
                    msg:'没有获取到package.json信息'
                };
                yield this.save_deploy_log(Object.assign(projectInfo),config);
                config.status = false;
                return config;
            }
            // 获取package.json 配置 webhook
            const webhookConfig = webhookConfigResult.data.webhook;

            // 环节二 查询配置项 查询配置项 是否完整
            if (!webhookConfig || !webhookConfig.build_path || !webhookConfig[projectInfo.ip]){
                console.log(webhookConfig);
                let config = {
                    status_code:-1,
                    msg:'webhook配置信息不完整'
                };
                yield this.save_deploy_log(projectInfo, config);
                config.status = false;
                return config;
            }
            return  webhookConfigResult;
        }

        *save_deploy_log(projectInfo,deployInfo, git_url) {
            const deployStatusText = {
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
            var config = {
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
                config.fail_file = deployInfo.fail_file
            }
            if (deployInfo.err) {
                config.error = deployInfo.err;
            }
            if (deployInfo.success_file) {
                config.success_file = deployInfo.success_file
            }
            if (deployInfo.service) {
                config.service_ip = deployInfo.service.ip;
                config.service_account = deployInfo.service.account;
            }
            yield this.app.knex('webhook_deploy_log').insert(config);
            let webhook_deploy_config = {
                deploy_status: deployInfo.status_code,
                deploy_status_text: deployInfo.msg || deployStatusText[deployInfo.status_code] || '未知错误'
            };
            try {
                yield this.app.knex('webhook_service_deploy').update(webhook_deploy_config).where({
                    project_id:projectInfo.project_id,
                    user_id: projectInfo.user_id,
                    webhook_id:projectInfo.id,
                    service_id: projectInfo.service_id
                });
            } catch (err) {

            }
            var webhookConfig = {
                deploy_status: deployInfo.status_code || 0,
                deploy_status_text: deployStatusText[deployInfo.status_code] || '未知错误',
                updated_at: new Date()
            };
            yield this.app.knex('webhook').update(webhookConfig).where({
                project_id: projectInfo.project_id,
                user_id: projectInfo.user_id
            });
            if (deployInfo.status === 500) {
                this.delpoySuccess(deployInfo.status,deployInfo.description);
            } else {
                this.success(deployInfo);
            }
        }
        * deploy_log(ctx){
            let queryField = ['project_id','user_id','webhook_id'];
            let output_field = ['deploy_status','deploy_status_text', 'service_id'];
            let query = ctx.query;
            let queryConfig = {};
            for (let i =0;i< queryField.length; i++) {
                if (!query[queryField[i]]) {
                    this.error(`${queryField[i]} 参数为空`)
                    return
                }
                queryConfig[queryField[i]] = query[queryField[i]];
            }
            const result = yield ctx.app.knex('webhook_service_deploy').select(output_field).where(queryConfig);
            if (result[0]) {
                this.success(result);
            } else {
                this.error('没有查询到该项目的配置信息，请重新配置项目')
            }
        }
    }
    return HomeController;
};
