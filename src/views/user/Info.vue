<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">编辑个人信息</h3>
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="80px"
      class="space-y-6 pt-4"
    >
      <el-form-item prop="username" label="用户名">
        <el-input
          v-model="form.username"
          placeholder="用户名"
          class="w-full"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="large"
          @click="onSubmit"
          class="w-full"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { GetUserInfo } from '@/api/user'

// form 状态
const form = ref({
  id: '',
  username: ''
})
const formRef = ref(null)

// 校验规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, message: '用户名至少 2 个字符', trigger: 'blur' }
  ]
}

const accountTableName = window.sessionStorage.getItem('accountTableName') || 'users'
const currentUsername = window.sessionStorage.getItem('username') || ''

// 获取当前用户信息
async function fetchUser() {
  try {
    const res = await GetUserInfo(accountTableName)
    console.log(res)
    form.value.username = res.username
  } catch (err) {
    ElMessage.error(err.message || '网络错误，获取用户信息失败')
  }
}

// 提交更新
function onSubmit() {
  formRef.value.validate(async valid => {
    if (!valid) return
    try {
      const rest = await GetUserInfo(accountTableName)
      if (res.data.code === 0) {
        ElMessage.success('更新成功')
        // 更新 sessionStorage 并刷新页面
        window.sessionStorage.setItem('username', form.value.username)
        fetchUser()
      } else if (res.data.code === 401) {
        window.location.replace('/login')
      } else {
        ElMessage.error(res.data.msg || '更新失败')
      }
    } catch (err) {
      ElMessage.error(err.message || '网络错误，更新失败')
    }
  })
}

onMounted(fetchUser)
</script>