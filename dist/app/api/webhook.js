'use strict';

module.exports = function (app) {
  /**
  * @api { GET } /api/webhook/list 获取webhook列表
  * @apiVersion 1.0.0
   * @apiGroup webhook
  * @apiParam {number} page 商场名称
  * @apiParam {number} pageSize 开始日
  * @apiSampleRequest /api/webhook/list
  * */
  app.get('/api/webhook/list', app.controller.webhook.list);
  /**
  * @api { POST } '/api/webhook/operate' webhook操作
  * @apiVersion 1.0.0
   * @apiGroup webhook
  * @apiParam {String} id 当前项目唯一标识
  * @apiParam {string} service 关联服务id
  * @apiParam {string} status  状态 1 可见 0 不可见
  * @apiSampleRequest /api/webhook/operate
  * */
  app.post('/api/webhook/operate', app.controller.webhook.operate);
  /**
  * @api { POST } /api/webhook/deploy 部署
  * @apiVersion 1.0.0
   * @apiGroup webhook
  * @apiParam {String} id webhook项目id
  * @apiSampleRequest /api/webhook/deploy
  * */
  app.get('/api/webhook/deploy', app.controller.webhook.deploy);
  /**
   * 获取项目部署的服务器的状态码
   *
   * */
  app.get('/api/webhook/deploy_log', app.controller.webhook.deploy_log);
};
//# sourceMappingURL=webhook.js.map