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
      path: 'projects/:rialtoId?/:projectId?',
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
      path: 'chats',
      name: 'chats',
      component: () => import('pages/ChatsPage.vue'),
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
      path: 'teams-registry/:teamId',
      name: 'team-detail',
      component: () => import('../components/TeamsRegistryPage.vue'),
      props: true
    },
    {
      path: 'my-teams',
      name: 'my-teams',
      component: () => import('../pages/MyTeams.vue'),
      meta: {requiresAuth: true},
      children: [
        {
          path: '',
          name: 'my-teams-default',
          redirect: {name: 'i-member'},
        },
        {
          path: 'i-member',
          name: 'i-member',
          component: () => import('../components/MemberTeamList.vue')
        },
        {
          path: 'create-requests',
          name: 'create-requests',
          component: () => import('../components/CreateTeamRequests.vue'),
          props: () => ({
            isDeleteDialogOpen: false
          })
        },
        {
          path: 'i-teamleader',
          name: 'i-teamleader',
          component: () => import('../components/LeaderTeamList.vue'),
          props: () => ({
            isTeamDeleteDialogOpen: false
          })
        },
      ]
    },
    {
      path: 'requests-moderation',
      name: 'requests-moderation',
      component: () => import('../components/RequestsModerationPage.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'my-projects',
      name: 'my-projects',
      component: () => import('../components/MyProjects.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: 'my-requests',
      name: 'my-requests',
      component: () => import('../pages/MyRequests.vue'),
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
