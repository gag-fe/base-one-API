'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (app) {
    var CustomController = function (_app$Controller) {
        _inherits(CustomController, _app$Controller);

        function CustomController() {
            _classCallCheck(this, CustomController);

            return _possibleConstructorReturn(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).apply(this, arguments));
        }

        _createClass(CustomController, [{
            key: 'success',
            value: function success(data) {
                this.ctx.body = {
                    success: true,
                    data: data
                };
                this.ctx.status = 200;
            }
        }, {
            key: 'error',
            value: function error(msg) {
                msg = msg || 'error';
                this.ctx.body = {
                    success: false,
                    message: msg
                };
            }
        }, {
            key: 'notFound',
            value: function notFound(msg) {
                msg = msg || 'not found';
                this.ctx.throw(404, msg);
            }
        }, {
            key: 'user',
            get: function get() {
                return this.ctx.session.user;
            }
        }]);

        return CustomController;
    }(app.Controller);

    app.Controller = CustomController;
};
//# sourceMappingURL=app1.js.map