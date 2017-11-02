'use strict';

module.exports = app => {
    /**
    * @api { get } /api/projects 获取所有项目
    * @apiVersion 1.0.0
    * @apiGroup project
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery page  number（非必填 分页 默认1）
    * @apiQuery pageSize  number（非必填 分页大小 默认20）
    * @apiQuery archived  Boolean（非必填 存档状态）
    * @apiQuery visibility  string（非必填 public<公用>, internal<内部>, private<私有的>）
    * @apiQuery order_by  string（非必填 id, name, path, created_at, updated_at or last_activity_at 排序方式 默认created_at）
    * @apiQuery sort  string（非必填  asc和desc 排序 默认desc）
    * @apiQuery search  string（非必填 模糊查找标准）
    * @apiSampleRequest /api/project
    * */
    app.get('/api/project', app.controller.projects.get_project);
    /**
    * @api { get } /api/projects 获取自己的项目
    * @apiVersion 1.0.0
    * @apiGroup project
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery page  number（非必填 分页 默认1）
    * @apiQuery pageSize  number（非必填 分页大小 默认20）
    * @apiQuery archived  Boolean（非必填 存档状态）
    * @apiQuery visibility  string（非必填 public<公用>, internal<内部>, private<私有的>）
    * @apiQuery order_by  string（非必填 id, name, path, created_at, updated_at or last_activity_at 排序方式 默认created_at）
    * @apiQuery sort  string（非必填  asc和desc 排序 默认desc）
    * @apiQuery search  string（非必填 模糊查找标准）
    * @apiSampleRequest /api/project/owned
    * */
    app.get('/api/project/owned', app.controller.projects.get__projects_owned);
    /**
    * @api {get} /api/search_project 查询某一个项目
    * @apiVersion 1.0.0
    * @apiGroup peoject
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery id int 项目id
    * @apiSampleRequest /api/search_project
    * */
    app.get('/api/search_project', app.controller.projects.search_project);
    /**
    * @api {get} /api/search_peoject_tags 查询某项目的tags
    * @apiVersion 1.0.0
    * @apiGroup peoject
    * @apiHeader private_token 'edzRkkssef-y2JYh2AaC'
    * @apiQuery id int 项目id(必填)
    * @apiQuery tag_name string tag_name(非必填)
    * @apiSampleRequest /api/search_peoject_tags
    * */
    app.get('/api/search_peoject_tags', app.controller.projects.search_peoject_tags);
};
