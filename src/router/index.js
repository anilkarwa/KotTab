import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Setting from '@/components/Setting'
import TableList from '@/components/TableList'
import MenuList from '@/components/MenuList'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
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
      path: '/table',
      name: 'TableList',
      component: TableList
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
    }
  ]
})
