'use strict';
var underscore = require('underscore');
module.exports = app => {
    class SessionController extends app.Controller {
        * login(ctx) {
            var username = ctx.request.body.username;
            const password = ctx.request.body.password;
            if (!username || !password) {
               this.error('参数有误');
                return;
            }
            // 切割邮箱
            if (username.indexOf('@') !== -1) {
                username = username.split('@')[0];
            }

            const result = yield ctx.curl('http://git.gag.cn/api/v3/session', {
                method: 'POST',
                dataType: 'json',
                data: {
                    login: username,
                    password: password
                }
            });
            const field = ['id','username','email','name', 'avatar_url'];
            let config = {};

            if (result.status < 300) {
                const reData = result.data;
                const userid = reData.id;
                const userResult = yield this.app.knex('user').where({id: userid});
                field.map((key) => {
                    config[key] = reData[key]
                });
                config['token'] = reData['private_token'];
                config['update_at'] =new Date();
                if (!userResult.length ){
                    let obj = {
                        created_at: new Date(),
                        status: 1,
                        update_at: new Date(),
                        password: password
                    };
                    // 插入新的数据
                    yield this.app.knex('user').insert(Object.assign({},config, obj))
                }

                this.success(config);
            } else {
                this.error('401 Unauthorized', result.status);
            }
        }
    }
    return SessionController;
};
