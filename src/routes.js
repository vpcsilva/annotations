import VueRouter from 'vue-router';
import Hello from './components/annotation.vue';

export default {
  routes: [
    {
      path: '/hello',
      name: 'hello',
      component: Hello
    },
    {
      path: '*',
      redirect: {name: 'hello'}
    }
  ]
}