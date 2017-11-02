'use strict';
var underscore = require('underscore');
module.exports = app => {
    class HomeController extends app.Controller {
        // 查找项目
        * get_project(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error({
                    message: '401 Unauthorized'
                }, 401);
                return;
            }
            var query = ctx.query;
            var page = query.page || 1;
            var pageSize = query.pageSize || 20;
            if (page <= 0 || pageSize <= 0) {
                this.error('参数有误', 400);
            }
            query = underscore.pairs(query);
            query = query.filter(function(value) {
                return value[0] !== 'page' && value[0] !== 'pageSize';
            }).map(function(value) {
                return value.join('=');
            });
            query = query.join('&');
            if (query) {
                query = '&' + query;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/projects?private_token=${private_token}${query}`, {
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
                this.error(result.data.message, result.status);
            }
        }
        * get__projects_owned(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error('401 Unauthorized', 401);
                return;
            }
            var query = ctx.query;
            var page = query.page || 1;
            var pageSize = query.pageSize || 10;
            if (page <= 0 || pageSize <= 0) {
                this.error('参数有误', 400);
            }
            query = underscore.pairs(query);
            query = query.map(function(value) {
                return value.join('=');
            });
            query = query.join('&');
            if (query) {
                query = '&' + query;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/projects/owned?private_token=${private_token}${query}`,{
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
                this.error(result.data.message, result.status);
            }
        }
        // 查询某项目
        * search_project(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error('401 Unauthorized', 401);
                return;
            }
            const id = ctx.query.id;
            if (underscore.isNull(id) || underscore.isUndefined(id)) {
                this.error('参数有误', 400);
                return;
            }

            const result = yield ctx.curl(`${this.app.baseUrl}/projects/${id}?private_token=${private_token}`, {
                dataType: 'json'
            });
            this.gitlab_result(result);
        }
        // 查询某项目 tags
        * search_peoject_tags(ctx) {
            const private_token = ctx.query.token;
            if (private_token == undefined) {
                this.error('401 Unauthorized', 401);
                return;
            }
            const id = ctx.query.id;
            var tag_name = ctx.query.tag_name || '';
            if (tag_name) {
                tag_name = '/' + tag_name;
            }
            if (underscore.isNull(id) || underscore.isUndefined(id) || underscore.isNull(tag_name) || underscore.isUndefined(tag_name)) {
                this.error('参数有误', 400);
                return;
            }
            const result = yield ctx.curl(`${this.app.baseUrl}/projects/${id}/repository/tags${tag_name}?private_token=${private_token}`, {
                dataType: 'json'
            });
            this.gitlab_result(result);
        }

    }
    return HomeController;
};
