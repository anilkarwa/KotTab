import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Setting from '@/components/Setting'
import TableList from '@/components/TableList'

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
    }
  ]
})
