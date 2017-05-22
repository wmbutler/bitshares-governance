import Vue from 'vue';
import Router from 'vue-router';
import Lookup from '@/components/Lookup';
import About from '@/components/About';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/about',
      alias: '/',
      name: 'About',
      component: About,
    },
    {
      path: '/lookup/:baseaccount?',
      name: 'Lookup',
      component: Lookup,
    },
  ],
});
