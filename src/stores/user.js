import { defineStore } from "pinia";
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userInfo = reactive({})

  const logout = () => {
    isLogin.value = false
    userInfo.username = ''
    userInfo.role = ''
    window.sessionStorage.clear()
  }

  return {
    isLogin,
    userInfo,
    logout,
  }
})