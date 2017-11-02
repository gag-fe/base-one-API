'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (app) {
    return function (_app$Service) {
        _inherits(User, _app$Service);

        function User() {
            _classCallCheck(this, User);

            return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));
        }

        _createClass(User, [{
            key: 'device_cnt_bill_cnt',
            value: /*#__PURE__*/regeneratorRuntime.mark(function device_cnt_bill_cnt() {
                var mall_name, start_date, end_date, result;
                return regeneratorRuntime.wrap(function device_cnt_bill_cnt$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                mall_name = this.ctx.query.mall_name || '上海正大广场';
                                start_date = this.ctx.query.start_date || '20170501';
                                end_date = this.ctx.query.end_date || '20171011';
                                _context.next = 5;
                                return this.app.knex.column('week_first_day', 'cat1', 'shop_cnt', 'device_cnt', 'bill_cnt').select().from('dy_active_device_cat1').where('mall_name', mall_name).andWhere('week_first_day', '>=', start_date).andWhere('week_first_day', '<=', end_date);

                            case 5:
                                result = _context.sent;
                                return _context.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, device_cnt_bill_cnt, this);
            })
        }, {
            key: 'device_by_mall_name',
            value: /*#__PURE__*/regeneratorRuntime.mark(function device_by_mall_name() {
                var result;
                return regeneratorRuntime.wrap(function device_by_mall_name$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.app.knex.column('mall_name').select().from('dy_organization');

                            case 2:
                                result = _context2.sent;
                                return _context2.abrupt('return', result);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, device_by_mall_name, this);
            })
        }, {
            key: 'push',
            value: /*#__PURE__*/regeneratorRuntime.mark(function push() {
                return regeneratorRuntime.wrap(function push$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, push, this);
            })
        }]);

        return User;
    }(app.Service);
};
//# sourceMappingURL=deploy.js.map