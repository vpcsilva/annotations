import VueRouter from 'vue-router';
import Home from './components/home.vue';

export default {
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
}