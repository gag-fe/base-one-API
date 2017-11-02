'use strict';

module.exports = function (app) {
    /**
    * @api { get } /api/user 获取所有用户
    * @apiVersion 1.0.0
    * @apiGroup users
    * @apiHeader Authorization 'edzRkkssef-y2JYh2AaC'
    * @apiQuery id int （非必填 查询单个用户）
    * @apiSampleRequest /api/user
    * */
    app.get('/api/user', app.controller.user.get_user);
    /**
     * @api {get} /api/check_user_token 检查user token 是否过期
     * @apiVersion 1.0.0
     * @apiGroup users
     * @apiQuery private_token
     * */
    app.get('/api/check_user_token', app.controller.user.check_user_token);
};
//# sourceMappingURL=user.js.map