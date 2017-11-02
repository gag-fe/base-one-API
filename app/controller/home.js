'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    hello() {
        return "你好"
    }
    * index(ctx) {
        var result = yield this.getPackageJSON(ctx);
        ctx.body = {
            holle: {
                holle:this.hello(),
                result: result.data || {}
            }
        }
    }
    * get(ctx) {
      const result = yield ctx.app.curl('http://git.gag.cn/api/v3/projects?private_token=XfuKh_TqjqRt-KaZgyXc&username=yaojiasong', {
        dataType: 'json'
      });
      this.success(result.data);
    }
    * post(ctx) {
        const result = yield ctx.app.curl('http://git.gag.cn/api/v3/session', {
            method: 'POST',
            dataType: 'json',
            data: {
                login: 'yaojiasong',
                password: 'Yao921305',
                email: 'yaojiasong@gooagoo.com'
            }
        });

        ctx.body = result;
    }
  }
  return HomeController;
};
