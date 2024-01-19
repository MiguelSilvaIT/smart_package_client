import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Order from '../components/orders/Order.vue'
import Orders from '../components/orders/Orders.vue'
import Product from '../components/products/Product.vue'
import Products from '../components/products/Products.vue'
import Login from '../components/auth/Login.vue'
import TransportPackage from '../components/transportPackages/TransportPackage.vue'
import TransportPackages from '../components/transportPackages/TransportPackages.vue'
import CatalogProducts from '../components/catalogProducts/CatalogProducts.vue'
import ManageCatalogProducts from '../components/catalogProducts/ManageCatalogProducts.vue'
import { useUserStore } from '../stores/user.js'

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
    {
      path: '/orders',
      name: 'orders',
      component: Orders
    },
    {
      path: '/orders/:id',
      name: 'Order',
      component: Order,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/products/:id',
      name: 'Product',
      component: Product,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path:'/catalogProducts',
      name: 'catalogProducts',
      component: CatalogProducts,
    },
    {
      path:'/manageCatalogProducts',
      name: 'manageCatalogProducts',
      component: ManageCatalogProducts,
    },
    {
      path: '/products',
      name: 'NewProduct',
      component: Product,
      props: { id: -1 }
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/transport_packages',
      name: 'transportPackages',
      component: TransportPackages
    },
    {
      path: '/transport_packages/:id',
      name: 'TransportPackage',
      component: TransportPackage,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/transport_packages',
      name: 'NewTransportPackage',
      component: TransportPackage,
      props: { id: -1 }
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
  const userStore = useUserStore()
  if (handlingFirstRoute) {
      handlingFirstRoute = false
      await userStore.restoreToken()
    }
  if ((to.name == 'Login') || (to.name == 'home')) {
    next()
    return
  }
  next()
})

export default router
