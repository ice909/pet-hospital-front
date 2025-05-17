<template>
  <div class=" w-screen h-screen flex justify-center items-center login-page">
    <div id="login-wrapper">
      <form id="loginForm">
        <h1>欢迎登陆"格格"宠物医院医疗管理系统</h1>

        <div class="form-group">
          <label class="label">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="用户名"
            class="form-control-i"
            required
          />
        </div>

        <div class="form-group">
          <label class="label">密码</label>
          <input
            type="password"
            v-model="password"
            placeholder="密码"
            class="form-control-i"
            required
          />
        </div>

        <!-- Role selection section -->
        <div class="form-group-r">
          <!-- Role options will be generated here -->
          <el-radio-group v-model="role">
            <template v-for="menu in menus">
              <el-radio :value="menu.tableName">{{ menu.roleName }}</el-radio>
            </template>
          </el-radio-group>
        </div>

        <div class="form-group-l-r">
          <button class="btn btn-primary pull-right" type="submit" @click.prevent="login">
            登 录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Login } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const role = ref('users')
const menus = ref([
  { roleName: '管理员', tableName: 'users' },
  { roleName: '医生', tableName: 'yisheng' },
  { roleName: '用户', tableName: 'yonghu' },
]) // Add your menu data here

// Methods
const login = async () => {
  if (!username.value || !password.value) {
    alert('用户名和密码不能为空')
    return
  }
  console.log('Login attempt with', username.value, password.value, role.value)

  // 获取role对应的 roleName
  const selectedRole = menus.value.find((menu) => menu.tableName === role.value)

  const res = await Login(role.value,selectedRole.roleName,  username.value, password.value)
  if (res.code !== 0) {
    ElMessage.error(res.msg)
    return
  }

  window.sessionStorage.setItem('accountTableName', role.value)
  window.sessionStorage.setItem('username', username.value)
  window.sessionStorage.setItem('token', res.token)
  window.sessionStorage.setItem('role', res.role)
  userStore.isLogin = true
  userStore.userInfo = {
    username: username.value,
    role: res.role,
  }
  router.push('/')
}
</script>

<style scoped>
.login-page {
  background-image: url(http://codegen.caihongy.cn/20201223/72a1e0e0cd6a467ea781956764818af0.jpg) !important;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center;
}

#login-wrapper {
  display: flex;
  flex-direction: column;
  position: inherit;
  height: 460px;
  width: 500px;
  margin: 0;
  padding: 0px;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  border-color: rgba(239, 67, 0, 1);
  background-color: rgba(255, 255, 255, 1);
  box-shadow:
    0px 29px 147.5px 102.5px rgb(0 0 0 / 5%),
    0px 29px 95px 0px rgb(0 0 0 / 16%);
}

#login-wrapper h1 {
  line-height: 70px;
  width: 100%;
  color: rgba(0, 0, 0, 1);
  font-size: 26px;
  margin: 0 0 20px 0;
  padding: 2px 10px;
  border-radius: 0;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: rgba(220, 222, 226, 1);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 6px rgba(30, 144, 255, 0);
  text-align: center;
}

#loginForm .form-group-l-r {
  display: flex;
  flex-wrap: wrap;
}

#loginForm .form-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: auto;
  width: 80%;
  margin: 0 auto;
  padding: 0 0 10px 0;
  border-radius: 0px;
  border-width: 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 1);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 6px rgba(255, 0, 0, 0);
}

#loginForm .form-group .label {
  width: 72px;
  line-height: 10px;
  margin: 10px 0 0 0;
  color: rgba(102, 102, 102, 1);
  font-size: 16px;
  padding: 0;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  border-color: rgba(255, 255, 255, 1);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 6px rgba(255, 0, 0, 0);
  text-align: left;
}

#loginForm .form-group .form-control-i {
  width: 100%;
  height: 37px;
  margin: 20px 0 0px 0;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  padding: 0 10px;
  border-radius: 0;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(206, 212, 218, 1);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0px rgba(30, 144, 255, 0.5);
  text-align: left;
}

#loginForm .form-group .form-control-i:focus {
  outline: 0 none;
}

#loginForm .form-group-r {
  display: flex;
  align-items: center;
  width: 80%;
  height: 44px;
  margin: 10px auto;
  padding: 0;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 1);
  background-color: rgba(255, 255, 255, 0);
  box-shadow: 0px;
}

#loginForm .form-group-r .checkbox {
  margin: 0 10px 0 0;
  padding: 0;
  display: flex;
  align-items: center;
}

#loginForm .form-group-r .checkbox label {
  color: rgba(188, 188, 188, 1);
  font-size: 14px;
  margin: 0;
  margin-top: -1px;
}

#loginForm .form-group-r .checkbox.active label {
  color: rgba(239, 67, 0, 1);
  font-size: 14px;
}

#loginForm .form-group-r .checkbox input {
  margin: 0;
  margin-right: 4px;
}

#loginForm button.pull-right {
  outline: none;
  width: 80%;
  height: 44px;
  margin: 0 auto;
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(255, 115, 14, 1);
  background-color: rgba(239, 67, 0, 1);
  box-shadow: 0px;
}

#loginForm a.btn-register {
  display: inline-block;
  width: 80%;
  height: 44px;
  margin: 10px auto;
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 0;
  border-width: 0;
  border-style: solid;
  background-color: rgba(231, 231, 231, 1);
  box-shadow: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

#loginForm .codes {
  display: none;
}

#loginForm .codes input {
  width: calc(100% - 84px);
  height: 44px;
  margin: 0;
  color: #1e90ff;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 0;
  border-width: 1px;
  border-style: solid;
  border-color: #1e90ff;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(30, 144, 255, 0);
  outline: none;
}

#loginForm .codes .nums {
  width: 84px;
  height: 44px;
  margin: 0;
  padding: 0;
  border-radius: 0;
  border-width: 1px 1px 1px 0;
  border-style: solid;
  border-color: #1e90ff;
  background-color: #f5f5f5;
  box-shadow: 0 0 6px rgba(30, 144, 255, 0);
  outline: none;
}
</style>
