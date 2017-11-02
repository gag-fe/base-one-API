'use strict';

module.exports = function (app) {
    /**
    * @api get /api/groups 获取所有项目
    * @apiVersion 1.0.0
    * @apiGroup groups
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery page  number（非必填 分页 默认1）
    * @apiQuery pageSize  number（非必填 分页大小 默认20）
    * @apiSampleRequest /api/groups
    * */
    app.get('/api/groups', app.controller.groups.get_all_groups);
    /**
    * @api get /api/search_groups 获取所有项目
    * @apiVersion 1.0.0
    * @apiGroup groups
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery page  number（非必填 分页 默认1）
    * @apiQuery pageSize  number（非必填 分页大小 默认20）
    * @apiQuery id int (必填 查询某项目组下的项目)
    * @apiQuery archived  Boolean（非必填 存档状态）
    * @apiQuery visibility  string（非必填 public<公用>, internal<内部>, private<私有的>）
    * @apiQuery order_by  string（非必填 id, name, path, created_at, updated_at or last_activity_at 排序方式 默认created_at）
    * @apiQuery sort  string（非必填  asc和desc 排序 默认desc）
    * @apiQuery search  string（非必填 模糊查找标准）
    * @apiSampleRequest /api/search_groups
    * */
    app.get('/api/search_groups', app.controller.groups.search_groups_by_id);
    /**
    * @api { get } /api/groups_details 获取所有项目
    * @apiVersion 1.0.0
    * @apiGroup groups
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery id int (必填 查询某项目组下的项目)
    * @apiSampleRequest /api/groups_details
    * */
    app.get('/api/groups_details', app.controller.groups.groups_details_by_id);
};
//# sourceMappingURL=groups.js.map