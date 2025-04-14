import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/UserAuth.vue'),
    name: 'auth',
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
    {
      path: 'profile',
      name: 'profile',
      component: () => import('components/ProfilePage.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'projects-exchange',
      name: 'projects-exchange',
      component: () => import('pages/ProjectWorkContinue.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'teams-registry',
      name: 'teams-registry',
      component: () => import('../components/TeamsRegistryPage.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'my-teams',
      name: 'my-teams',
      component: () => import('../components/MyTeams.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'requests-moderation',
      name: 'requests-moderation',
      component: () => import('../components/RequestsModerationPage.vue'),
      meta: {requiresAuth: true}
    },
  ],
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
