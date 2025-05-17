import { defineStore } from "pinia";
import { reactive,ref } from "vue";

export const useUserStore = defineStore("user", () => { 
  const isLogin = ref(false)
  const userInfo = reactive({})

  return {
    isLogin,
    userInfo
  }
})