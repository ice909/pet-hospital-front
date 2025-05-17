<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">用户管理</h3>

    <!-- 搜索与操作按钮 -->
    <el-row :gutter="10">
      <el-col :span="5">
        <el-input v-model="search.username" placeholder="用户名" />
      </el-col>
      <el-col :span="5">
        <el-input v-model="search.fullName" placeholder="用户姓名"  />
      </el-col>
      <el-col :span="10">
        <el-button type="primary"  @click="handleSearch">查询</el-button>
        <el-button type="success"  @click="handleAdd">添加</el-button>
        <el-button
          type="danger"
          :disabled="!multipleSelection.length"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="userList"
      border
      @selection-change="onSelectionChange"
      class="my-4 pt-8"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户名" sortable />
      <el-table-column prop="fullName" label="用户姓名" sortable />
      <el-table-column label="头像">
        <template #default="{ row }">
          <img :src="row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" sortable />
      <el-table-column prop="phone" label="手机号码" sortable />
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="info" @click="handleView(row)"> 查看 </el-button>
          <el-button type="warning" @click="handleEdit(row)"> 修改 </el-button>
          <el-button type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页与页大小 -->
    <div class="flex items-center justify-between pt-6">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑用户' : '添加用户'"
      width="600px"
      :before-close="onClose"
      class="overflow-auto"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="space-y-4"
        :disabled="opType === 'view'"
        :hide-required-asterisk="opType === 'view'"
      >
        <el-form-item prop="yonghuming" label="用户名">
          <el-input v-model="form.yonghuming" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item v-if="opType != 'view'" prop="mima" label="密码">
          <el-input v-model="form.mima" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item prop="yonghuxingming" label="用户姓名">
          <el-input v-model="form.yonghuxingming" placeholder="请输入用户姓名" />
        </el-form-item>

        <el-form-item label="头像">
          <div class="flex items-center gap-3">
            <img v-if="form.touxiang" :src="form.touxiang" :width="100" :height="100" />
            <el-upload
              class="flex-1"
              action="/api/file/upload"
              :headers="{ Authorization: `Bearer ${token}` }"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <el-button>选择文件</el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item prop="xingbie" label="性别">
          <el-select v-model="form.xingbie" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>

        <el-form-item prop="shoujihaoma" label="手机号码">
          <el-input v-model="form.shoujihaoma" placeholder="请输入手机号码" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button v-if="opType == 'view'" @click="onClose">关闭</el-button>
          <template v-else>
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submitForm"> 提交 </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetUserList, AddUser, DeleteUser, UpdateUser } from '@/api/user'

// 搜索条件
const search = reactive({
  username: '',
  fullName: '',
})

// 列表数据 & 分页
const userList = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const multipleSelection = ref([])

const dialogVisible = ref(false)
const opType = ref('add')
const formRef = ref(null)
const form = reactive({
  id: '',
  yonghuming: '',
  mima: '',
  yonghuxingming: '',
  touxiang: '',
  xingbie: '',
  shoujihaoma: '',
})
const token = window.sessionStorage.getItem('token') || ''

const rules = {
  yonghuming: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  mima: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  yonghuxingming: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }],
  xingbie: [{ required: true, message: '请选择性别', trigger: 'change' }],
  shoujihaoma: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur',
    },
  ],
}

// 获取用户列表
async function fetchData() {
  loading.value = true
  let params = {
    page: page.value,
    limit: pageSize.value,
    sort: '',
    order: '',
  }

  if (search.username != undefined && search.username != '') {
    params.yonghuming = search.username
  }

  if (search.fullName != undefined && search.fullName != '') {
    params.yonghuxingming = search.fullName
  }

  try {
    const res = await GetUserList({
      page: page.value,
      limit: pageSize.value,
      sort: '',
      order: '',
    })
    console.log(res)
    if (res.code === 0) {
      userList.value = res.data.list.map((item) => ({
        id: item.id,
        username: item.yonghuming,
        mima: item.mima,
        fullName: item.yonghuxingming,
        avatar: item.touxiang,
        gender: item.xingbie,
        phone: item.shoujihaoma,
      }))
      total.value = res.data.totalPage * pageSize.value
    } else if (res.code === 401) {
      window.location.replace('/login')
    } else {
      ElMessage.error('获取列表失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '网络错误')
  } finally {
    loading.value = false
  }
}

// 事件处理
function handleSearch() {
  page.value = 1
  fetchData()
}
function handlePageChange(current) {
  page.value = current
  fetchData()
}
function onSelectionChange(val) {
  multipleSelection.value = val
}
function handleAdd() {
  form.id = ''
  // 跳转到新增页面
  dialogVisible.value = true
}
function handleView(row) {
  opType.value = 'view'
  dialogVisible.value = true
  window.sessionStorage.setItem('id', row.id)
  form.id = row.id
  form.yonghuming = row.username
  form.yonghuxingming = row.fullName
  form.touxiang = row.avatar
  form.xingbie = row.gender
  form.shoujihaoma = row.phone
}
function handleEdit(row) {
  window.sessionStorage.setItem('id', row.id)
  opType.value = 'edit'
  dialogVisible.value = true
  form.id = row.id
  form.yonghuming = row.username
  form.mima = row.mima
  form.yonghuxingming = row.fullName
  form.touxiang = row.avatar
  form.xingbie = row.gender
  form.shoujihaoma = row.phone
}
function handleDelete(row) {
  ElMessageBox.confirm('确认删除此用户？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log('Deleting user with ID:', row.id)
      await DeleteUser([row.id])
      fetchData()
    })
    .catch(() => {})
}
function handleBatchDelete() {
  const ids = multipleSelection.value.map((u) => u.id)
  ElMessageBox.confirm('确认删除选中的用户？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await DeleteUser(ids)
      fetchData()
    })
    .catch(() => {})
}

function handleUploadSuccess(res) {
  console.log('Upload success:', res)
  // 假设后端返回 { file: 'xxx.png' }
  form.touxiang = 'http://127.0.0.1:8081/jspmjl5mx/upload/' + res.file
}

// 关闭弹窗，重置表单
function onClose() {
  dialogVisible.value = false
  formRef.value && formRef.value.resetFields()
  form.id = ''
  form.yonghuming = ''
  form.mima = ''
  form.yonghuxingming = ''
  form.touxiang = ''
  form.xingbie = ''
  form.shoujihaoma = ''
  window.sessionStorage.removeItem('id')
  opType.value = 'add'
}

// 提交表单
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (opType.value === 'edit') {
        await UpdateUser(form)
        ElMessage.success('修改成功')
      } else {
        await AddUser(form)
        ElMessage.success('添加成功')
      }
      
      onClose()
      fetchData()
    } catch (err) {
      ElMessage.error(err.response?.data?.msg || '操作失败')
    } finally {
      loading.value = false
    }
  })
}

// 首次加载
onMounted(fetchData)
</script>

<style scoped>
/* TailwindCSS 提供绝大部分样式 */
</style>
