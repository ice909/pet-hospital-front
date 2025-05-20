import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useUserStore } from '@/stores/user'


import UserPassword from '@/views/user/Password.vue'
import UserInfo from '@/views/user/Info.vue'
import Users from '@/views/admin/Users.vue'
import UsersDoctor from '@/views/admin/UsersDoctor.vue'
import Knowledge from '@/views/knowledge/Index.vue'
import Department from '@/views/department/Index.vue'
import Doctors from '@/views/doctors/Index.vue'
import Appointment from '@/views/appointment/Index.vue'
import MedicalAdvice from '@/views/medical/Advice.vue'
import Medicine from '@/views/medicine/Index.vue'
import Order from '@/views/order/Index.vue'
import Statistics from '@/views/order/statistics.vue'
import Message from '@/views/message/Index.vue'
import News from '@/views/system/News.vue'
import Banner from '@/views/system/Banner.vue'
import SysIndex from '@/views/system/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'SysIndex',
          component: SysIndex,
          meta: { title: '系统首页', roles: ['管理员', '用户', '医生'] },
        },
        {
          path: '/user/password',
          name: 'UserPassword',
          component: UserPassword,
          meta: { title: '修改密码', roles: ['管理员', '医生', '用户'] },
        },
        {
          path: '/user/info',
          name: 'UserInfo',
          component: UserInfo,
          meta: { title: '个人信息', roles: ['管理员', '医生', '用户'] },
        },
        {
          path: '/users',
          name: 'Users',
          component: Users,
          meta: { title: '用户管理', roles: ['管理员'] },
        },
        {
          path: '/users/doctor',
          name: 'UsersDoctor',
          component: UsersDoctor,
          meta: { title: '医生管理', roles: ['管理员'] },
        },
        {
          path: '/knowledge',
          name: 'Knowledge',
          component: Knowledge,
          meta: { title: '医学知识管理', roles: ['管理员', '医生', '用户'] },
        },
        {
          path: '/department',
          name: 'Department',
          component: Department,
          meta: { title: '科室信息管理', roles: ['管理员'] },
        },
        {
          path: '/doctors',
          name: 'Doctors',
          component: Doctors,
          meta: { title: '医生信息管理', roles: ['管理员'] },
        },
        {
          path: '/appointment',
          name: 'Appointment',
          component: Appointment,
          meta: { title: '预约挂号管理', roles: ['管理员', '医生'] },
        },
        {
          path: '/medical/advice',
          name: 'MedicalAdvice',
          component: MedicalAdvice,
          meta: { title: '医嘱信息管理', roles: ['管理员', '医生'] },
        },
        {
          path: '/medicine',
          name: 'Medicine',
          component: Medicine,
          meta: { title: '药品信息管理', roles: ['管理员'] },
        },
        {
          path: '/order',
          name: 'Order',
          component: Order,
          meta: { title: '订单信息管理', roles: ['管理员', '用户', '医生'] },
        },
        {
          path: '/message',
          name: 'Message',
          component: Message,
          meta: { title: '留言板', roles: ['管理员', '用户'] },
        },
        {
          path: '/statistics',
          name: 'Statistics',
          component: Statistics,
        },
        // {
        //   path: '/news',
        //   name: 'News',
        //   component: News,
        //   meta: { title: '新闻资讯', roles: ['管理员'] },
        // },
        // {
        //   path: '/banner',
        //   name: 'Banner',
        //   component: Banner,
        //   meta: { title: '轮播图', roles: ['管理员'] },
        // },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/',
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.isLogin) next({ path: '/login' })
  else next()
})
export default router
