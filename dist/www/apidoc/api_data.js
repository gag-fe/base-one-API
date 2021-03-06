"use strict";

define({ "api": [{
    "type": "get",
    "url": "/query_device_data",
    "title": "获取商场数据",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "mall_name",
          "description": "<p>商场名称</p>"
        }, {
          "group": "Parameter",
          "type": "start_date",
          "optional": false,
          "field": "start_date",
          "description": "<p>开始日期</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "end_date",
          "description": "<p>结束日期</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://192.168.150.52:7001/query_device_data"
    }],
    "filename": "app1/router.js",
    "group": "_Users_yaojiasong_gooagoo_project_FE_egg_example_app_router_js",
    "groupTitle": "_Users_yaojiasong_gooagoo_project_FE_egg_example_app_router_js",
    "name": "GetQuery_device_data"
  }] });
//# sourceMappingURL=api_data.js.map