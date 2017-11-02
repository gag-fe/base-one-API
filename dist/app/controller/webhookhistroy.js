'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebhookLogField = ['id', 'project_name', 'created_at', 'deploy_status', 'deploy_status_text', 'error', 'fail_file', 'git_tags', 'git_back_ssh_url', 'service_account', 'service_ip', 'ssh_url', 'success_file', 'web_url', 'user_name'];

module.exports = function (app) {
    var HomeController = function (_app$Controller) {
        _inherits(HomeController, _app$Controller);

        function HomeController() {
            _classCallCheck(this, HomeController);

            return _possibleConstructorReturn(this, (HomeController.__proto__ || Object.getPrototypeOf(HomeController)).apply(this, arguments));
        }

        _createClass(HomeController, [{
            key: 'list',
            value: /*#__PURE__*/regeneratorRuntime.mark(function list(ctx) {
                var user_id, project_name, deploy_status, git_tags, service_ip, whereConfig, result;
                return regeneratorRuntime.wrap(function list$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user_id = ctx.query.user_id;
                                // const page = ctx.query.page || 1;
                                // const pageSize = ctx.query.pageSize || 20;

                                project_name = ctx.query.project_name;
                                deploy_status = ctx.query.deploy_status;
                                git_tags = ctx.query.git_tags;
                                service_ip = ctx.query.service_ip;

                                if (!(!user_id || user_id == undefined)) {
                                    _context.next = 8;
                                    break;
                                }

                                this.error('参数有误', 200);
                                return _context.abrupt('return');

                            case 8:
                                whereConfig = {
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
                                _context.next = 15;
                                return ctx.app.knex('webhook_deploy_log').select(WebhookLogField).where(whereConfig);

                            case 15:
                                result = _context.sent;

                                ///const size = result.length;
                                //result = result.splice((page-1) * pageSize , pageSize);
                                if (result.length) {
                                    this.success(result);
                                } else {
                                    this.success([]);
                                }

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, list, this);
            })
        }]);

        return HomeController;
    }(app.Controller);

    return HomeController;
};
//# sourceMappingURL=webhookhistroy.js.map