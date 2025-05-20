<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter, RouterView } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const role = computed(() => userStore.userInfo.role)

const allMenus = [
  {
    type: 'item',
    index: '0',
    label: '首页',
    path: '/',
    roles: ['管理员', '医生', '用户'],
  },
  
  {
    type: 'submenu',
    index: '1',
    title: '个人中心',
    roles: ['管理员', '医生', '用户'],
    children: [
      {
        index: '1-1',
        label: '修改密码',
        path: '/user/password',
        roles: ['管理员', '医生', '用户'],
      },
      {
        index: '1-2',
        label: '个人信息',
        path: '/user/info',
        roles: ['管理员', '医生', '用户'],
      },
    ],
  },
  {
    type: 'item',
    index: '2',
    label: '用户管理',
    path: '/users',
    roles: ['管理员'],
  },
  {
    type: 'item',
    index: '3',
    label: '医生管理',
    path: '/users/doctor',
    roles: ['管理员'],
  },
  {
    type: 'item',
    index: '4',
    label: '医学知识管理',
    path: '/knowledge',
    roles: ['管理员', '医生', '用户'],
  },
  {
    type: 'item',
    index: '5',
    label: '科室信息管理',
    path: '/department',
    roles: ['管理员'],
  },
  {
    type: 'item',
    index: '6',
    label: '医生信息管理',
    path: '/doctors',
    roles: ['管理员'],
  },
  {
    type: 'item',
    index: '7',
    label: '预约挂号管理',
    path: '/appointment',
    roles: ['管理员', '医生', '用户'],
  },
  {
    type: 'item',
    index: '8',
    label: '医嘱信息管理',
    path: '/medical/advice',
    roles: ['管理员', '医生', '用户'],
  },
  {
    type: 'item',
    index: '9',
    path: '/medicine',
    label: '药品信息管理',
    roles: ['管理员'],
  },
  {
    type: 'item',
    index: '10',
    label: '订单信息管理',
    path: '/order',
    roles: ['管理员', '用户'],
  },
  {
    type: 'item',
    index: '11',
    label: '留言板',
    path: '/message',
    roles: ['管理员', '用户'],
  },
  // {
  //   type: 'submenu',
  //   index: '12',
  //   title: '系统信息',
  //   roles: ['管理员'],
  //   children: [
  //     {
  //       index: '12-1',
  //       label: '新闻资讯',
  //       path: '/news',
  //       roles: ['管理员'],
  //     },
  //     {
  //       index: '12-2',
  //       label: '轮播图',
  //       path: '/banner',
  //       roles: ['管理员'],
  //     },
  //   ],
  // },
]

const filteredMenus = computed(() => {
  console.log('role.value', role.value)
  console.log('allMenus', allMenus)
  return (
    allMenus
      // 先筛掉顶层不允许的
      .filter((menu) => menu.roles.includes(role.value))
      // 如果是子菜单，再过滤它的 children
      .map((menu) => {
        if (menu.type === 'submenu') {
          const children = menu.children.filter((child) => child.roles.includes(role.value))
          return { ...menu, children }
        }
        return menu
      })
      // 最终如果某个 submenu 变成了空 children，也可以再剔除
      .filter((menu) => menu.type === 'item' || menu.children.length)
  )
})

const logout = () => {
  userStore.logout()
  router.push({ path: '/login' })
}
</script>

<template>
  <div class="common-layout">
    <el-container class="h-full">
      <el-header>
        <div class="flex justify-between items-center h-16 bg-[#F5F6FA] px-4">
          <h1 class="text-(--el-color-primary) text-3xl">“格格”宠物医院医疗管理系统</h1>
          <div class="flex items-center gap-2">
            <span class="text-xl">欢迎你：{{ userStore.userInfo.username }}</span>
            <el-dropdown placement="bottom">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container class="h-full">
        <el-aside width="200px" class="bg-[#FF6D4D] h-full">
          <el-menu background-color="#FF6D4D" text-color="#fff" active-text-color="#fff" router>
            <template v-for="menu in filteredMenus" :key="menu.index">
              <!-- 子菜单 -->
              <el-sub-menu v-if="menu.type === 'submenu'" :index="menu.index">
                <template #title
                  ><span>{{ menu.title }}</span></template
                >
                <el-menu-item
                  v-for="child in menu.children"
                  :key="child.index"
                  :index="child.index"
                  :route="child.path"
                >
                  {{ child.label }}
                </el-menu-item>
              </el-sub-menu>
              <!-- 普通菜单项 -->
              <el-menu-item v-else :index="menu.index" :route="menu.path"
                >{{ menu.label }}
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-main><router-view/></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
}
.el-header {
  padding: 0 !important;
}
.el-menu {
  border-right: none;
}
.el-menu span,
a,
li {
  user-select: none !important;
  font-size: 16px !important;
  font-weight: 700 !important;
}
</style>
