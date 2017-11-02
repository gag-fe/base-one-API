'use strict';
const underscore = require('underscore');
module.exports = app => {
    class UserController extends app.Controller {

        // 获取用户
        * get_user(ctx) {
            const id = ctx.query.id;
            var userId = '';
            if (id != undefined) {
                userId = '/'+id;
            }
            const private_token = ctx.request.header.token;
            const result = yield ctx.app.curl(`${this.app.baseUrl}/users${userId}?private_token=${private_token}`, {
                dataType: 'json'
            });

            if (result.status < 300) {
                this.success(result.data);
            } else {
                this.error(result.data, result.status);
            }
        }
        // 检查用户token 是否可用
        * check_user_token(ctx) {
            const private_token = ctx.query.token;
            if (!private_token || private_token == undefined) {
                this.error(`参数有误: token为${private_token}`);
                return;
            }
            const field = ['id','username','email','name', 'avatar_url','token','remark','update_at'];
            let output = {};
            const user_info = yield ctx.app.knex('user')
                .where({token: private_token});

            if (!user_info.length) {
                this.error('授权失败');
                return
            }
            const result = yield ctx.app.curl(`${this.app.baseUrl}/users?private_token=${private_token}`);

            if (user_info.length && result.status < 300) {
                field.map((key) => {
                    output[key] = user_info[0][key]
                });
                this.success(output);
            } else {
                this.error('授权失败', 401);
            }
        }
    }
    return UserController;
};
