'use strict';

module.exports = function (app) {
    /**
    * 项目 hook 钩子
     *
    * */
    app.post('/', app.controller.deploy.tag_push);
    //app.get('/deploy', app.controller.deploy.asyncDeploy);
};
//# sourceMappingURL=deploy.js.map