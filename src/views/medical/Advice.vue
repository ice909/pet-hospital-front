<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">医嘱信息</h3>

    <!-- 搜索与操作按钮 -->
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input v-model="search.username" placeholder="用户名" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.jobNumber" placeholder="医生工号" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.name" placeholder="医生姓名" />
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="success" @click="handleAdd">添加</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="adviceList"
      border
      @selection-change="onSelectionChange"
      class="my-4 pt-8"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="yonghuming" label="用户名" sortable />
      <el-table-column prop="yonghuxingming" label="用户姓名" sortable />
      <el-table-column prop="chongwuming" label="宠物名" sortable />
      <el-table-column prop="chongwuzhuangkuang" label="宠物状况" sortable />
      <el-table-column prop="yizhu" label="医嘱" />
      <el-table-column prop="riqi" label="日期" sortable />
      <el-table-column prop="yishenggonghao" label="医生工号" sortable />
      <el-table-column prop="yishengxingming" label="医生姓名" sortable />
      <el-table-column prop="keshi" label="科室" sortable />
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="info" @click="handleView(row)"> 查看 </el-button>
          <el-button type="warning" @click="handleEdit(row)"> 修改 </el-button>
          <el-button type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <!-- 
      <el-table-column prop="chongwuzhuangkuang" label="宠物状况" sortable />
      <el-table-column prop="yizhu" label="医嘱" />
      <el-table-column prop="riqi" label="日期" sortable />
      <el-table-column prop="yishenggonghao" label="医生工号" sortable />
      <el-table-column prop="yishengxingming" label="医生姓名" sortable />
      <el-table-column prop="keshi" label="科室" sortable /> -->
        <el-form-item prop="yonghuming" label="用户名">
          <el-input v-model="form.yonghuming" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="yonghuxingming" label="用户姓名">
          <el-input v-model="form.yonghuxingming" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item prop="chongwuming" label="宠物名">
          <el-input v-model="form.chongwuming" placeholder="请输入宠物名" />
        </el-form-item>
        <el-form-item prop="chongwuzhuangkuang" label="宠物状况">
          <el-input v-model="form.chongwuzhuangkuang" placeholder="请输入宠物状况" />
        </el-form-item>
        <el-form-item prop="yizhu" label="医嘱">
          <el-input v-model="form.yizhu" placeholder="请输入医嘱" />
        </el-form-item>
        <el-form-item prop="riqi" label="日期">
          <el-input v-model="form.riqi" type="datetime-local" step="1" placeholder="请输入日期" />
        </el-form-item>
        <el-form-item prop="yishenggonghao" label="医生工号">
          <el-input v-model="form.yishenggonghao" placeholder="请输入医生工号" />
        </el-form-item>
        <el-form-item prop="yishengxingming" label="医生姓名">
          <el-input v-model="form.yishengxingming" placeholder="请输入医生姓名" />
        </el-form-item>
        <el-form-item prop="keshi" label="科室">
          <el-input v-model="form.keshi" placeholder="请输入科室" />
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
import { GetAdviceList, AddAdvice, DeleteAdvice, UpdateAdvice } from '@/api/advice'
import dayjs from 'dayjs'

// 搜索条件
const search = reactive({
  jobNumber: '',
  name: '',
  username: '',
})

// 列表数据 & 分页
const adviceList = ref([])
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
  yonghuxingming: '',
  chongwuming: '',
  chongwuzhuangkuang: '',
  yizhu: '',
  riqi: '',
  yishenggonghao: '',
  yishengxingming: '',
  keshi: '',
})

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

  if (search.jobNumber != undefined && search.jobNumber != '') {
    params.yishenggonghao = search.jobNumber
  }

  if (search.name != undefined && search.name != '') {
    params.yishengxingming = search.name
  }

  window.sessionStorage.setItem('tableName', 'yisheng')

  try {
    const res = await GetAdviceList({
      page: page.value,
      limit: pageSize.value,
      sort: '',
      order: '',
    })
    console.log(res)
    if (res.code === 0) {
      adviceList.value = res.data.list.map((item) => ({
        id: item.id,
        yonghuming: item.yonghuming,
        yonghuxingming: item.yonghuxingming,
        chongwuming: item.chongwuming,
        chongwuzhuangkuang: item.chongwuzhuangkuang,
        yizhu: item.yizhu,
        riqi: item.riqi,
        yishenggonghao: item.yishenggonghao,
        yishengxingming: item.yishengxingming,
        keshi: item.keshi,
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
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.chongwuming = row.chongwuming
  form.chongwuzhuangkuang = row.chongwuzhuangkuang
  form.yizhu = row.yizhu
  form.riqi = row.riqi
  form.yishenggonghao = row.yishenggonghao
  form.yishengxingming = row.yishengxingming
  form.keshi = row.keshi
}
function handleEdit(row) {
  window.sessionStorage.setItem('id', row.id)
  opType.value = 'edit'
  dialogVisible.value = true
  form.id = row.id
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.chongwuming = row.chongwuming
  form.chongwuzhuangkuang = row.chongwuzhuangkuang
  form.yizhu = row.yizhu
  form.riqi = row.riqi
  form.yishenggonghao = row.yishenggonghao
  form.yishengxingming = row.yishengxingming
  form.keshi = row.keshi
}
function handleDelete(row) {
  ElMessageBox.confirm('确认删除此用户？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log('Deleting user with ID:', row.id)
      await DeleteAdvice([row.id])
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
      await DeleteAdvice(ids)
      fetchData()
    })
    .catch(() => {})
}

// 关闭弹窗，重置表单
function onClose() {
  dialogVisible.value = false
  formRef.value && formRef.value.resetFields()
  form.id = ''
  form.yonghuming = ''
  form.yonghuxingming = ''
  form.chongwuming = ''
  form.chongwuzhuangkuang = ''
  form.yizhu = ''
  form.riqi = ''
  form.yishenggonghao = ''
  form.yishengxingming = ''
  form.keshi = ''
  window.sessionStorage.removeItem('id')
  opType.value = 'add'
}

// 提交表单
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    form.riqi = dayjs(form.riqi).format('YYYY-MM-DD HH:mm:ss')
    try {
      if (opType.value === 'edit') {
        await UpdateAdvice(form)
        ElMessage.success('修改成功')
      } else {
        await AddAdvice(form)
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
