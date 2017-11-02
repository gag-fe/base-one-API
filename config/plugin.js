'use strict';

// had enabled by egg
// exports.static = true;
exports.mysql = {
    enable: true,
    package: 'egg-knex',
};


exports.cors = {
  enable: true,
  package: 'egg-cors'
};

exports.security = {
    domainWhiteList: ['http://localhost:3000','http://localhost:4200']
};

exports.view = {
    enable: true,
    package: 'egg-view',
};
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks',
};
