'use strict';

module.exports = app => {
    return class User extends app.Service {
        * device_cnt_bill_cnt() {
           var mall_name = this.ctx.query.mall_name || '上海正大广场';
           var start_date = this.ctx.query.start_date || '20170501';
           var end_date = this.ctx.query.end_date || '20171011';
           const result = yield this.app.knex
           							.column('week_first_day','cat1','shop_cnt','device_cnt','bill_cnt')
           							.select().from('dy_active_device_cat1')
           							.where('mall_name',mall_name)
           							.andWhere('week_first_day','>=', start_date)
           							.andWhere('week_first_day','<=', end_date);
           	return result;
        }
        * device_by_mall_name() {
          const result = yield this.app.knex.column('mall_name').select().from('dy_organization');
          return result; 
        }
        * push() {
            
        }
    };
};
