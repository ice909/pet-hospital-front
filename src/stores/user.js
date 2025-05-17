import { defineStore } from "pinia";
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userInfo = reactive({})
  const accountTableName = ref('')
  const accountTableMap = {
    管理员: 'users',
    医生: 'yisheng',
    用户: 'yonghu',
  }

  const logout = () => {
    isLogin.value = false
    userInfo.username = ''
    userInfo.role = ''
    userInfo.id = ''
    accountTableName.value = ''
    window.sessionStorage.clear()
  }

  const setAccountTableName = () => {
    if (userInfo.role) {
      accountTableName.value = accountTableMap[userInfo.role]
    }
  }

  return {
    isLogin,
    userInfo,
    logout,
    accountTableName,
    setAccountTableName,
  }
})