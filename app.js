'use strict';

/**
 *  两个数组之间 求交集
 * */
Array.intersect = function () {
    let result = [];
    let obj = {};
    for (let i = 0; i < arguments.length; i++) {
        for (let j = 0; j < arguments[i].length; j++) {
            let str = arguments[i][j];
            if (!obj[str]) {
                obj[str] = 1;
            }
            else {
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
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        obj[arr[i]] = 1;
    }
    for (let j = 0; j < this.length; j++) {
        if (!obj[this[j]])
        {
            obj[this[j]] = 1;
            result.push(this[j]);
        }
    }
    return result;
};



module.exports = app => {
    app.baseUrl = 'http://git.gag.cn/api/v3';
    class CustomController extends app.Controller {
        success(data) {
            this.ctx.body = {
                msg: '操作成功',
                status: 'S',
                data,
                status_code: 200
            };
        }
        error(message, status) {
            status = status || 200;
            if (typeof message == 'string') {
                this.ctx.body = {
                    msg: message,
                    status_code: status,
                    status: 'F'
                };
            } else {
                this.ctx.body =Object.assign({}, {
                    status_code: status,
                    status: 'F'
                },message);
            }
        }
        notFound(msg) {
            msg = msg || 'not found';
            this.ctx.throw(404, msg);
        }

        check_private_token() {
            const private_token = this.ctx.request.header.private_token;
            if (private_token == undefined) {
                this.ctx.throw(403,'没有权限');
            }
        }
        gitlab_result(result) {
            if (result.status < 300) {
                this.success(result.data);
            } else {
                var msg = result.data.message || '操作失败';
                this.error(msg, result.status);
            }
        }
        delpoyFalie(deploy_status,description) {
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
        delpoySuccess(deploy_status,description) {
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
        * getPackageJSON() {
            var result = yield this.ctx.curl('http://git.gag.cn/FE_BFK/webhook-test/raw/master/package.json?private_token=XfuKh_TqjqRt-KaZgyXc',{
                dataType: 'json'
            });
            return result;
        }
        /**
         * 插入 webhook_service_deploy
         * @param user_id int user id 号
         * @param project_id int 项目 id
         * @param webhook_id webhook 项目 id
         * @param isInit 是否初始化
         * @param serviceIds 需要 部署的服务 ID 号
         * */
        *inset_service_deploy(user_id,project_id,webhook_id,serviceIds, isInit ) {
            let serviceIdsArr = serviceIds || [];
            let del_service_ids = []; // 需要删除的 服务器 部署信息
            let instart_service_ids = []; // 需要插入的 服务器 部署信息
            let commmon_service_ids = [];
            let insertArr = [];
            let current_service_ids = []; //当前项目服务id
            const serviceConfig = {
                deploy_status: 0,
                deploy_status_text: '尚未部署',
                updated_at: new Date(),
                created_at: new Date(),
                user_id,
                project_id,
                webhook_id
            };
            if (isInit) {
                yield this.app.knex('webhook_service_deploy').where({
                    user_id: user_id,
                    project_id: project_id,
                    webhook_id: webhook_id
                }).del();
                serviceIds.map((id_key) => {
                    insertArr.push(Object.assign({}, serviceConfig, {
                        service_id: id_key
                    }))
                });
                if (insertArr.length) {
                    yield this.app.knex('webhook_service_deploy').insert(insertArr);
                }
                return true;
            }

            const current_service_info = yield this.app.knex('webhook_service_deploy').where({
                user_id,
                project_id,
                webhook_id
            });


            /*
            *  以 current 为主线
            *  current.length === 0  // 全部插入
            *  current.length !== 0
            * */
            current_service_info.map((webhookService) => {
                current_service_ids.push(webhookService.service_id);
            });
            // 求 服务集合的并集
            commmon_service_ids = Array.intersect(serviceIdsArr,current_service_ids);
            // 需要插入的 service ids
            instart_service_ids = serviceIdsArr.minus(commmon_service_ids);
            // 需要删除的 service ids
            del_service_ids = current_service_ids.minus(commmon_service_ids);
            // 先删除
            if (del_service_ids.length) {
                try {
                    let result = yield this.app.knex('webhook_service_deploy').where({
                        user_id: user_id,
                        project_id: project_id,
                        webhook_id: webhook_id
                    }).whereIn('service_id',del_service_ids).del();
                } catch (err){
                    return false
                }
            }
            // 再插入
            if (instart_service_ids.length) {
                instart_service_ids.map((id_key) => {
                    insertArr.push(Object.assign({}, serviceConfig, {
                        service_id: id_key
                    }))
                });
                if (insertArr.length) {
                    yield this.app.knex('webhook_service_deploy').insert(insertArr);
                }
            }
            return true;
        }
    }
    app.Controller = CustomController;
};
