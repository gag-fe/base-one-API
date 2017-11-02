'use strict';
const underscore = require('underscore');
module.exports = app => {
    class HomeController extends app.Controller {
        // 获取 所有 grounds
        * get_all_groups(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error({
                    message: '401 Unauthorized'
                }, 401);
                return;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/groups?private_token=${private_token}`, {
                dataType: 'json'
            });
            this.gitlab_result(result);

        }
        // 查询某项目组下 项目
        * search_groups_by_id(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error({
                    message: '401 Unauthorized'
                }, 401);
                return;
            }
            var query = ctx.query;
            const page = query.page || 1;
            const pageSize = query.pageSize || 20;
            const id = query.id;
            if (id == undefined) {
                this.error({
                    message: '参数有误'
                }, 400);
                return;
            }
            query = underscore.pairs(query);
            query = query.filter(function(value) {
                return value[0] !== 'page' && value[0] !== 'pageSize' && value[0] !== 'id';
            }).map(function(value) {
                return value.join('=');
            });
            query = query.join('&');
            if (query) {
                query = '&' + query;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/groups/${id}/projects?private_token=${private_token}${query}`, {
                dataType: 'json'
            });
            if (result.status < 300) {
                var data = result.data;
                data = {
                    data: data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
                    size: data.length
                };
                this.success(data);
            } else {
                this.error(result.data, result.status);
            }
        }
        * groups_details_by_id(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error({
                    message: '401 Unauthorized'
                }, 401);
                return;
            }
            var query = ctx.query;
            const id = query.id;
            if (id == undefined) {
                this.error({
                    message: '参数有误'
                }, 400);
                return;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/groups/${id}?private_token=${private_token}`, {
               dataType: 'json'
            });
            this.gitlab_result(result);
        }
    }
    return HomeController;
};
