'use strict';
const underscore = require('underscore');
const node_ssh = require('node-ssh');
const SSH = new node_ssh();
const field = ['id','ip','name','account','pkey','ssh_key','port','service_tag','service_tag_text','service_tag','updated_at','remark','status'];
module.exports = app => {
    class HomeController extends app.Controller {
        // 列表
        * list(ctx) {
            const user_id = ctx.query.user_id;
            if (user_id == undefined) {
                this.error('参数有误', 200);
                return;
            }
            // let page = ctx.query.page || 1;
            // let pageSize = ctx.query.pageSize || 20;
            // pageSize = parseInt(pageSize);
            // let start = (page -1) * pageSize;
            // start <= 0 && (start =1);
            let result = yield ctx.app.knex('service').where({user_id,status: 1}).select(field); //.limit(pageSize-1).offset(start-1);
            if(result.length) {
                this.success(result)
            } else {
                this.error('没有查询到相关数据', 200);
            }
        }
        // 通过服务器id 查询该条数据
        * service_by_id(ctx) {
            let user_id = ctx.query.user_id;
            let service_id = ctx.query.service_id;
            if (!user_id || !service_id) {
                this.error('参数有误', 200);
                return;
            }
            const result = yield ctx.app.knex('service').select(field).where({
                id: service_id,
                user_id: user_id
            });
            if (result.length) {
                this.success(result[0])
            } else {
                this.error('没有查到相关数据');
            }
        }
        // 操作
        * operate(ctx) {
            const body = ctx.request.body;
            const service_tag_text_obj = {
                test: '测试服务器',
                official: '正式服务器'
            };
            const queryField = ['user_id','name','ip','account','pkey','ssh_key'];
            let config ={};
            queryField.map((key) => {
                if (!body[key]) {
                    this.error(`${key} 参数不能为空`);
                    return;
                } else {
                    config[key] = body[key]
                }
            });
            const id = body.id;
            const port = body.port || 80;
            config.port = port;
            const remark = body.remark || '';
            config.remark = remark;
            const status = body.status || 0;
            config.status = status;
            config['service_tag'] = body.service_tag || 'test';
            config['service_tag_text'] = service_tag_text_obj[config['service_tag']] || '测试服务器';
            let check_resulr = yield this.checkService(config);
            if (!check_resulr.status) {
                this.error({
                    error: check_resulr.error
                }, 200);
                return;
            }
            let result;
            // 添加或者更新服务器
            if (id) {
                config.id = id;
                config.updated_at = new Date();
                yield this.app.knex('service').update(config).where({
                    id: id
                });
                result = yield this.app.knex('service').where({
                    id: id,
                    status: 1
                })
            } else { // 添加服务器
                config.created_at = new Date();
                config.updated_at = new Date();
                config.status = 1;
                var getId = yield this.app.knex('service').insert(config);
                result = yield this.app.knex('service').select(field).where({
                    id: getId[0],
                    status: 1
                })
            }
            if (status === 0) {
                ctx.body = {
                    status: 'S',
                    msg: '数据删除成功',
                    data: []
                }
            }
            this.success(result[0]);

        }
        // 检查服务器是否可用
        * checkService(config) {
            const LoginService = new Promise((resolve,reject) => {
                SSH.connect({
                    host: config.ip,
                    username: config.account,
                    privateKey: config.ssh_key
                }).then((res) => {
                    resolve({
                        msg: '登录成功',
                        status: true
                    })
                }).catch((err) => {
                    reject({
                        msg: '登录失败',
                        status: false,
                        error: String(err)
                    })
                })
            })
            let outPut;
            const result = yield LoginService.then((res) => {
                outPut = res;
            }).catch((res) => {
                outPut = res;
            });
            return outPut;
        }

    }
   return HomeController;
};
