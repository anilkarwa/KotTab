import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Printer from '@/components/Printers'
import NewHome from '@/components/NewHome'
import OrderManagement from '@/components/OrderManager'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/printer',
      name: 'Printer',
      component: Printer
    },
    {
      path: '/home',
      name: 'NewHome',
      component: NewHome
    },
    {
      path: '/orderManagement',
      name: 'OrderManagement',
      component: OrderManagement
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to.name, localStorage.getItem('UserID'))
  if (to.name === 'Login' && localStorage.getItem('UserID')) {
    return next('/home')
  }
  if ((to.name !== 'Login' && from.name !== 'Login') && !localStorage.getItem('UserID')) {
    return next('/')
  }
  next()
})
export default router
