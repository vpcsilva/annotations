import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import routes from './routes';

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter(routes);

new Vue({
  router,
  el: '#app',
  render: h => h(App),
  created () {
    console.log('App created');
  },
  mounted () {
    console.log('App mounted');
  },
  updated () {
    console.log('App updated');
  },
  destroyed () {
    console.log('App destroyed');
  }
});
