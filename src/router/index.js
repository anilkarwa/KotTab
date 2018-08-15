import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Setting from '@/components/Setting'
import MenuList from '@/components/MenuList'
import Test from '@/components/Test'
import Printer from '@/components/Printers'
import OccupiedTables from '@/components/OccupiedTables'
import VacantTables from '@/components/VacantTables'
import ItemDescription from '@/components/ItemDescription'
import Checkout from '@/components/Checkout'
import ActiveOrder from '@/components/ActiveOrder'
import FinalScreen from '@/components/FinalScreen'
import FinalScreenb from '@/components/FinalScreenBackup'

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
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/menu',
      name: 'MenuList',
      component: MenuList
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/printer',
      name: 'Printer',
      component: Printer
    },
    {
      path: '/ot',
      name: 'OccupiedTables',
      component: OccupiedTables
    },
    {
      path: '/vt',
      name: 'VacantTables',
      component: VacantTables
    },
    {
      path: '/description',
      name: 'ItemDescription',
      component: ItemDescription
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    },
    {
      path: '/activeorder',
      name: 'ActiveOrder',
      component: ActiveOrder
    },
    {
      path: '/fc',
      name: 'FinalScreen',
      component: FinalScreen
    },
    {
      path: '/fcb',
      name: 'FinalScreenb',
      component: FinalScreenb
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
    return next('/setting')
  }
  if ((to.name !== 'Login' && from.name !== 'Login') && !localStorage.getItem('UserID')) {
    return next('/')
  }
  next()
})
export default router
