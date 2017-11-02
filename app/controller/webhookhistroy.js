'use strict';
const WebhookLogField = ['id','project_name','created_at','deploy_status','deploy_status_text','error','fail_file','git_tags','git_back_ssh_url','service_account','service_ip','ssh_url','success_file','web_url','user_name'];

module.exports = app => {
    class HomeController extends app.Controller {
        * list(ctx) {
            const user_id = ctx.query.user_id;
            // const page = ctx.query.page || 1;
            // const pageSize = ctx.query.pageSize || 20;
            const project_name = ctx.query.project_name;
            const deploy_status = ctx.query.deploy_status;
            const git_tags = ctx.query.git_tags;
            const service_ip = ctx.query.service_ip;
            if (!user_id || user_id == undefined) {
                this.error('参数有误', 200);
                return;
            }
            let whereConfig = {
                user_id: user_id
            };
            if (project_name) {
                whereConfig['project_name'] = project_name;
            }
            if (deploy_status) {
                whereConfig['deploy_status'] = deploy_status;
            }
            if (git_tags) {
                whereConfig['git_tags'] = git_tags;
            }
            if (service_ip) {
                whereConfig['service_ip'] = service_ip;
            }
            var result = yield ctx.app.knex('webhook_deploy_log').select(WebhookLogField).where(whereConfig);
            ///const size = result.length;
            //result = result.splice((page-1) * pageSize , pageSize);
            if (result.length) {
                this.success(result);
            } else {
                this.success([])
            }
        }
    }
    return HomeController;
};
