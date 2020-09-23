// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import htmlToPdf from './components/utils/htmlToPdf'
Vue.use(htmlToPdf)

axios.defaults.baseURL = 'http://localhost:9090';
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(iView);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
