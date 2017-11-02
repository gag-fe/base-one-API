'use strict';
const user = require('./api/user');
const session = require('./api/session');
const project = require('./api/projects');
const service = require('./api/service');
const webhook = require('./api/webhook');
const groups = require('./api/groups');
const deploy = require('./api/deploy');
const webhookhistory = require('./api/webhookhistroy');

module.exports = app => {
    app.get('/', 'home.index');
    app.get('/get', 'home.get');

    app.get('/post', 'home.post')
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
    // gitwebhook api
    webhook(app);
    // webhookhistory api
    webhookhistory(app);
    // groups api
    groups(app);
};
