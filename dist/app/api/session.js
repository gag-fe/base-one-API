'use strict';

module.exports = function (app) {
    /**
    * @api { POST } /api/session/login 登录
    * @apiVersion 1.0.0
    * @apiGroup session
    * @apiParam {String} username 用户名
    * @apiParam {start_date} password 密码
    * @apiSampleRequest /api/session/login
    * */
    app.post('/api/session/login', app.controller.session.login);
};
//# sourceMappingURL=session.js.map