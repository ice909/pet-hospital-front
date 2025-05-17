<template>
  <div class="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
    <h3 class="text-2xl font-semibold mb-4">修改密码信息</h3>
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="80px"
      class="space-y-4 pt-3"
    >
      <el-form-item prop="oldPassword" label="原密码">
        <el-input
          v-model="form.oldPassword"
          placeholder="原密码"
          show-password
        />
      </el-form-item>

      <el-form-item prop="newPassword" label="新密码">
        <el-input
          v-model="form.newPassword"
          placeholder="新密码"
          show-password
        />
      </el-form-item>

      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input
          v-model="form.confirmPassword"
          placeholder="确认密码"
          show-password
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
import { ref } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { UpdatePassword } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'


const userStore = useUserStore()
const router = useRouter()

// 表单初始模型
const form = ref({
  id: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 校验规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        if (value !== form.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const formRef = ref(null)

const onSubmit = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    try {
      await UpdatePassword(userStore.accountTableName, form.value.oldPassword, form.value.newPassword)
      // 清空表单
      form.value.oldPassword = ''
      form.value.newPassword = ''
      form.value.confirmPassword = ''
      ElMessageBox.alert('请重新登录', '密码修改成功', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: () => {
          userStore.logout()
          router.push('/login')
        },
      })
    } catch (err) {
      ElMessage.error(err.message || '修改失败')
    }
  })
}
</script>

<style scoped>
/* Tailwind CSS 已负责布局和样式 */
</style>