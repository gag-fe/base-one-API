'use strict';

var user = require('./api/user');
var session = require('./api/session');
var project = require('./api/projects');
var service = require('./api/service');
var webhook = require('./api/service');
var groups = require('./api/groups');
var deploy = require('./api/deploy');
var webhookhistory = require('./api/webhookhistroy');

module.exports = function (app) {
    app.get('/', 'home.index');
    app.get('/get', 'home.get');

    app.get('/post', 'home.post');
    /*
    * @api { POST } /api/deploy 接受webhook 钩子接口
    * @apiVersion 1.0.0
    * */
    deploy(app);
    // session api
    session(app);
    // user api
    user(app);
    // project api
    project(app);
    // service api
    service(app);
    // webhook api
    webhook(app);
    // webhookhistory api
    webhookhistory(app);
    // groups api
    groups(app);
};
//# sourceMappingURL=router.js.map