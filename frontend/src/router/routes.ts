import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/UserAuth.vue'),
    meta: {requiresAuth: false}
  },

  {
    path: '/Home',
    name: 'Home',
    component: () => import('pages/HomePage.vue'),
    meta: {requiresAuth: true},
    children: [{
      path: 'projects',
      name: 'projects',
      component: () => import('components/ProjectsTable.vue'),
      meta: {requiresAuth: true}
    },
  ]
  },

  

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {requiresAuth: false}
  },
];

export default routes;
