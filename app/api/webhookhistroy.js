'use strict';

module.exports = app => {
    /**
    * @api { GET } '/api/webhookhistroy/list' 注册
    * @apiVersion 1.0.0
    * @apiParam {number} page 分页
    * @apiParam {number} pageSize 分页大小
    * @apiSampleRequest '/api/webhookhistroy/list'
    * */
    app.get('/api/webhookhistroy/list', app.controller.webhookhistroy.list);
};
