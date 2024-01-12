import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    /*{
      path: '/reports',
      name: 'Reports',
      component: Report
    },
    {
      path: '/adminReports',
      name: 'AdminReports',
      component: AdminReports
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/admins/new',
      name: 'NewUser',
      component: User,
      props: { id: -1 }
    },
    {
      path: '/transactions/:id',
      name: 'Transaction',
      component: Transaction,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: "/transactions/new",
      name: "NewTransaction",
      component: Transaction,
      props: { id: -1 },
    },*/
  ]
})

let handlingFirstRoute = true

router.beforeEach( async (to, from, next) => {
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    }
  if ((to.name == 'Login') || (to.name == 'home')) {
    next()
    return
  }
  next()
})

export default router
