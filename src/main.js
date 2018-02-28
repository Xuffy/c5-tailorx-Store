import Vue from 'vue'
import App from './App'
import router from 'service/router'
import ajax from 'service/ajax'
import config from  'service/config';
import * as filters from 'service/filters.js'
import api from  'service/api';
import util from  'service/util';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'assets/style/main.less';

Vue.use(iView);
Vue.use(api);
Vue.use(util);

Vue.config.productionTip = false;

Vue.prototype.ajax = ajax;

window.TxConfig = config; // 嵌套项目配置 todo 重构完删除

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
