'use strict';
const path = require('path');
module.exports = appInfo => {
	const config = {
		knex: {
			client: {
			    // database dialect
			    dialect: 'mysql',
			    connection: {
					// host
					host: '192.168.3.101',
					// port
					port: '3306',
					// username
					user: 'root',
					// password
					password: 'system@123',
					// database
					database: 'gag_webhook',
				}
			},
			// load into app1, default is open
			app: true,
			// load into agent, default is close
			agent: false
		},
		cors: {
			origin: function(ctx) {
				return ctx.request.header.origin;
			},
			allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
            credentials: true
		},
        view: {
            root: path.join(appInfo.baseDir, 'www/apidoc'),
            defaultExtension: '.html',
            defaultViewEngine: 'nunjucks',
            mapping: { '.nj': 'nunjucks' }
        }
	};
	config.security = {
		csrf: false
	};
	// should change to your own
	config.keys = appInfo.name + '_1504597318621_8678';
	// add your config here
	return config;
};
