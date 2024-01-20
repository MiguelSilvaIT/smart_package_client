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
import Sensors from '../components/sensors/Sensors.vue'
import Sensor from '../components/sensors/Sensor.vue'
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
      path:'/catalog_products',
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
    {
      path: '/sensors',
      name: 'Sensors',
      component: Sensors,
    },
    {
      path: '/sensors/:id',
      name: 'Sensor',
      component: Sensor,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/sensors',
      name: 'NewSensor',
      component: Sensor,
      props: { id: -1 }
    },
    /*{
      path: '/reports',
      name: 'Reports',
      component: Report
    },
    {
      path: '/admins/new',
      name: 'NewUser',
      component: User,
      props: { id: -1 }
    },
    */
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
