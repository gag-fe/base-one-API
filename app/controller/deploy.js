'use strict';
const _ = require('underscore');
module.exports = app => {
    class DeployController extends app.Controller {
        /**
         * 项目部署 tag_push
         *  逻辑要求
         *  1、新tag_push 的项目；入库项目的 user_id，user_name，user_email，project_id，project_name，ssh_url，description，description
         *
         * */
        *tag_push(ctx) {
            const event = ctx.request.body.event_name;
            const repo = ctx.request.body;
            const ref = ctx.request.body.ref || '';
            const project = ctx.request.body.project;
            let webhook_id = '';
            let serviceIds;

            if (event !== 'tag_push' || ref.indexOf('publish') === -1) {
                this.error('没有部署', 402);
                return;
            }

            var tag = _.last(repo.ref.split('/')).split('#')[1] || 'v1.0.0';
            const projectArr = yield this.app.knex('webhook').where({
                project_id: repo.project_id
            });
            var config = {
                user_id: repo.user_id,
                user_name: repo.user_email.split('@')[0],
                user_email: repo.user_email,
                project_id: repo.project_id,
                project_name: project.name,
                ssh_url: project.ssh_url,
                web_url: project.web_url,
                description: project.description,
                git_tags:tag,
                status:1,
                deploy_status: 0,
                deploy_status_text: '尚未部署',
                updated_at: new Date()
            };

            if (projectArr.length) {
                webhook_id = projectArr[0].id;
                if (projectArr[0].service_ids) {
                    serviceIds = (projectArr[0].service_ids + '' || '').split(',');
                }

                yield this.app.knex('webhook').update(config).where({
                    project_id: repo.project_id,
                    user_id: repo.user_id
                });
            } else {
                config.created_at = new Date();
                let result = yield this.app.knex('webhook').insert(config);
                webhook_id = result[0];
            }
            if (webhook_id) {
                console.log(serviceIds);
                yield this.inset_service_deploy(repo.user_id,repo.project_id,webhook_id,serviceIds || [], true);
            }
            config = null;
            tag = null;
            this.success({data:1});
        }
    }
    return DeployController;
};
