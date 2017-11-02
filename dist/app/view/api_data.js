"use strict";

define({ "api": [{
    "type": " POST ",
    "url": "/api/service/list",
    "title": "服务器列表",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "page",
          "description": "<p>分页码 &gt;= 1</p>"
        }, {
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "pageSize",
          "description": "<p>分页大小</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/service/list"
    }],
    "filename": "app/api/service.js",
    "group": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_service_js",
    "groupTitle": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_service_js",
    "name": "_post_ApiServiceList"
  }, {
    "type": " POST ",
    "url": "/api/service/operate",
    "title": "服务列表操作",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "id",
          "description": "<p>服务唯一标识 非必填</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "name",
          "description": "<p>名称</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "port",
          "description": "<p>端口号</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "account",
          "description": "<p>Account账号</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "pkey",
          "description": "<p>pkey密码</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "sshkey",
          "description": "<p>SSHKey</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "status",
          "description": "<p>状态默认是1</p>"
        }, {
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "remark",
          "description": "<p>备注</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/service/operate"
    }],
    "filename": "app/api/service.js",
    "group": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_service_js",
    "groupTitle": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_service_js",
    "name": "_post_ApiServiceOperate"
  }, {
    "type": " GET ",
    "url": "'/api/webhookhistroy/list'",
    "title": "注册",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "page",
          "description": "<p>分页</p>"
        }, {
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "pageSize",
          "description": "<p>分页大小</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001'/api/webhookhistroy/list'"
    }],
    "filename": "app/api/webhookhistroy.js",
    "group": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_webhookhistroy_js",
    "groupTitle": "_Users_yaojiasong_gooagoo_project_react_gag_base_one_API_app_api_webhookhistroy_js",
    "name": "_get_ApiWebhookhistroyList"
  }, {
    "type": "",
    "url": "get",
    "title": "/api/groups 获取所有项目",
    "version": "1.0.0",
    "group": "groups",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/groups"
    }],
    "filename": "app/api/groups.js",
    "groupTitle": "groups",
    "name": "Get"
  }, {
    "type": "",
    "url": "get",
    "title": "/api/search_groups 获取所有项目",
    "version": "1.0.0",
    "group": "groups",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/search_groups"
    }],
    "filename": "app/api/groups.js",
    "groupTitle": "groups",
    "name": "Get"
  }, {
    "type": " get ",
    "url": "/api/groups_details",
    "title": "获取所有项目",
    "version": "1.0.0",
    "group": "groups",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/groups_details"
    }],
    "filename": "app/api/groups.js",
    "groupTitle": "groups",
    "name": "_get_ApiGroups_details"
  }, {
    "type": "get",
    "url": "/api/search_peoject_tags",
    "title": "查询某项目的tags",
    "version": "1.0.0",
    "group": "peoject",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/search_peoject_tags"
    }],
    "filename": "app/api/projects.js",
    "groupTitle": "peoject",
    "name": "GetApiSearch_peoject_tags"
  }, {
    "type": "get",
    "url": "/api/search_project",
    "title": "查询某一个项目",
    "version": "1.0.0",
    "group": "peoject",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/search_project"
    }],
    "filename": "app/api/projects.js",
    "groupTitle": "peoject",
    "name": "GetApiSearch_project"
  }, {
    "type": " get ",
    "url": "/api/projects",
    "title": "获取自己的项目",
    "version": "1.0.0",
    "group": "project",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/project/owned"
    }],
    "filename": "app/api/projects.js",
    "groupTitle": "project",
    "name": "_get_ApiProjects"
  }, {
    "type": " get ",
    "url": "/api/projects",
    "title": "获取所有项目",
    "version": "1.0.0",
    "group": "project",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "private_token",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/project"
    }],
    "filename": "app/api/projects.js",
    "groupTitle": "project",
    "name": "_get_ApiProjects"
  }, {
    "type": " POST ",
    "url": "/api/session/login",
    "title": "登录",
    "version": "1.0.0",
    "group": "session",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "username",
          "description": "<p>用户名</p>"
        }, {
          "group": "Parameter",
          "type": "start_date",
          "optional": false,
          "field": "password",
          "description": "<p>密码</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/session/login"
    }],
    "filename": "app/api/session.js",
    "groupTitle": "session",
    "name": "_post_ApiSessionLogin"
  }, {
    "type": "get",
    "url": "/api/check_user_token",
    "title": "检查user token 是否过期",
    "version": "1.0.0",
    "group": "users",
    "filename": "app/api/user.js",
    "groupTitle": "users",
    "name": "GetApiCheck_user_token",
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/check_user_token"
    }]
  }, {
    "type": " get ",
    "url": "/api/user",
    "title": "获取所有用户",
    "version": "1.0.0",
    "group": "users",
    "header": {
      "fields": {
        "Header": [{
          "group": "Header",
          "optional": false,
          "field": "Authorization",
          "description": "<p>'edzRkkssef-y2JYh2AaC'</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/user"
    }],
    "filename": "app/api/user.js",
    "groupTitle": "users",
    "name": "_get_ApiUser"
  }, {
    "type": " GET ",
    "url": "/api/webhook/list",
    "title": "获取webhook列表",
    "version": "1.0.0",
    "group": "webhook",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "page",
          "description": "<p>商场名称</p>"
        }, {
          "group": "Parameter",
          "type": "number",
          "optional": false,
          "field": "pageSize",
          "description": "<p>开始日</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/list"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_get_ApiWebhookList"
  }, {
    "type": " POST ",
    "url": "/api/webhook/auth",
    "title": "授权",
    "version": "1.0.0",
    "group": "webhook",
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/auth"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookAuth"
  }, {
    "type": " POST ",
    "url": "/api/webhook/deploy",
    "title": "部署",
    "version": "1.0.0",
    "group": "webhook",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "id",
          "description": "<p>webhook项目id</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/deploy"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookDeploy"
  }, {
    "type": " POST ",
    "url": "/api/webhook/nginx",
    "title": "代理",
    "version": "1.0.0",
    "group": "webhook",
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/nginx"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookNginx"
  }, {
    "type": " POST ",
    "url": "'/api/webhook/operate'",
    "title": "webhook操作",
    "version": "1.0.0",
    "group": "webhook",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "id",
          "description": "<p>当前项目唯一标识</p>"
        }, {
          "group": "Parameter",
          "type": "string",
          "optional": false,
          "field": "service",
          "description": "<p>关联服务id</p>"
        }, {
          "group": "Parameter",
          "type": "string",
          "optional": false,
          "field": "status",
          "description": "<p>状态 1 可见 0 不可见</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/operate"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookOperate"
  }, {
    "type": " POST ",
    "url": "'/api/webhook/start'",
    "title": "启动",
    "version": "1.0.0",
    "group": "webhook",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "id",
          "description": "<p>webhook项目id</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001'/api/webhook/start'"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookStart"
  }, {
    "type": " POST ",
    "url": "/api/webhook/stop",
    "title": "停止",
    "version": "1.0.0",
    "group": "webhook",
    "parameter": {
      "fields": {
        "Parameter": [{
          "group": "Parameter",
          "type": "String",
          "optional": false,
          "field": "id",
          "description": "<p>webhook项目id</p>"
        }]
      }
    },
    "sampleRequest": [{
      "url": "http://127.0.0.1:7001/api/webhook/stop"
    }],
    "filename": "app/api/webhook.js",
    "groupTitle": "webhook",
    "name": "_post_ApiWebhookStop"
  }] });
//# sourceMappingURL=api_data.js.map