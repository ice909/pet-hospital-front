<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">预约挂号</h3>

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
      :data="doctorList"
      border
      @selection-change="onSelectionChange"
      class="my-4 pt-8"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="yonghuming" label="用户名" sortable />
      <el-table-column prop="yonghuxingming" label="用户姓名" sortable />
      <el-table-column prop="shoujihaoma" label="手机号码" sortable />
      <el-table-column prop="chongwuming" label="宠物名" sortable />
      <el-table-column prop="chongwuzhuangkuang" label="宠物状况" sortable />
      <el-table-column prop="yuyueriqi" label="预约日期" sortable />
      <el-table-column prop="yishenggonghao" label="医生工号" sortable />
      <el-table-column prop="yishengxingming" label="医生姓名" sortable />
      <el-table-column prop="keshimingcheng" label="科室名称" sortable />
      <el-table-column label="是否审核" sortable>
        <template #default="{ row }">
          {{ !row.sfsh ? '否' : row.sfsh }}
        </template>
      </el-table-column>
      <el-table-column prop="shhf" label="审核回复" sortable />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="success" @click="handleReviewView(row)"> 审核 </el-button>
          <el-button type="success" @click="handleView(row)"> 医嘱 </el-button>
          <el-button type="info" @click="handleView(row)"> 查看 </el-button>
          <el-button type="warning" @click="handleEdit(row)"> 修改 </el-button>
          <el-button type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
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
        <el-form-item prop="yonghuxingming" label="用户姓名">
          <el-input v-model="form.yonghuxingming" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item prop="shoujihaoma" label="手机号码 ">
          <el-input v-model="form.shoujihaoma" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item prop="chongwuming" label="宠物名">
          <el-input v-model="form.chongwuming" placeholder="请输入宠物名" />
        </el-form-item>
        <el-form-item prop="chongwuzhuangkuang" label="宠物状况">
          <el-input v-model="form.chongwuzhuangkuang" placeholder="请输入宠物状况" />
        </el-form-item>
        <el-form-item prop="yuyueriqi" label="预约日期">
          <el-input
            v-model="form.yuyueriqi"
            type="datetime-local"
            step="1"
            placeholder="请输入预约日期"
          />
        </el-form-item>

        <el-form-item prop="yishenggonghao" label="医生工号">
          <el-input v-model="form.yishenggonghao" placeholder="请输入医生工号" />
        </el-form-item>
        <el-form-item prop="yishengxingming" label="医生姓名">
          <el-input v-model="form.yishengxingming" placeholder="请输入医生姓名" />
        </el-form-item>
        <el-form-item prop="keshimingcheng" label="科室">
          <el-input v-model="form.keshimingcheng" placeholder="请输入医生科室" />
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
    <!-- 审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="审核"
      width="600px"
      :before-close="onReviewClose"
      class="overflow-auto"
    >
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="rules"
        label-width="100px"
        class="space-y-4"
        :disabled="opType === 'view'"
        :hide-required-asterisk="opType === 'view'"
      >
        <el-form-item prop="sfsh" label="是否审核" required>
          <el-select
            v-model="reviewForm.sfsh"
            placeholder="是否审核"
            size="large"
            style="width: 240px"
          >
            <el-option value="是" />
            <el-option value="否" />
          </el-select>
        </el-form-item>
        <el-form-item prop="shhf" label="审核回复" required>
          <el-input v-model="reviewForm.shhf" type="textarea" placeholder="请输入审核回复" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="onReviewClose">取消</el-button>
          <el-button type="primary" :loading="loading" @click="submitReviewForm"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  GetAppointmentList,
  AddAppointment,
  DeleteAppointment,
  UpdateAppointment,
  AppointmentInfo,
} from '@/api/appointment'
import { computed } from 'vue'
import dayjs from 'dayjs'

// 搜索条件
const search = reactive({
  jobNumber: '',
  name: '',
  username: '',
})

// 列表数据 & 分页
const doctorList = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const multipleSelection = ref([])
const dialogTitle = computed(() => {
  return opType.value === 'add' ? '挂号' : opType.value === 'edit' ? '修改挂号信息' : '查看挂号信息'
})

const dialogVisible = ref(false)
const reviewDialogVisible = ref(false)
const opType = ref('add')
const formRef = ref(null)
const reviewFormRef = ref(null)
const reviewForm = reactive({
  id: '',
  chongwuming: '',
  chongwuzhuangkuang: '',
  keshimingcheng: '',
  sfsh: '',
  shhf: '',
  shoujihaoma: '',
  yishenggonghao: '',
  yishengxingming: '',
  yonghuming: '',
  yonghuxingming: '',
  yuyueriqi: '',
})
const form = reactive({
  id: '',
  chongwuming: '',
  chongwuzhuangkuang: '',
  keshimingcheng: '',
  sfsh: '',
  shhf: '',
  shoujihaoma: '',
  yishenggonghao: '',
  yishengxingming: '',
  yonghuming: '',
  yonghuxingming: '',
  yuyueriqi: '',
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
    const res = await GetAppointmentList({
      page: page.value,
      limit: pageSize.value,
      sort: '',
      order: '',
    })
    console.log(res)
    if (res.code === 0) {
      doctorList.value = res.data.list.map((item) => ({
        id: item.id,
        chongwuming: item.chongwuming,
        chongwuzhuangkuang: item.chongwuzhuangkuang,
        keshimingcheng: item.keshimingcheng,
        sfsh: item.sfsh,
        shhf: item.shhf,
        shoujihaoma: item.shoujihaoma,
        yishenggonghao: item.yishenggonghao,
        yishengxingming: item.yishengxingming,
        yonghuming: item.yonghuming,
        yonghuxingming: item.yonghuxingming,
        yuyueriqi: item.yuyueriqi,
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

const handleReviewView = async (row) => {
  reviewDialogVisible.value = true
  const { data } = await AppointmentInfo(row.id)
  console.log(data)
  reviewForm.id = data.id
  reviewForm.chongwuming = data.chongwuming
  reviewForm.chongwuzhuangkuang = data.chongwuzhuangkuang
  reviewForm.keshimingcheng = data.keshimingcheng
  reviewForm.sfsh = data.sfsh || '否'
  reviewForm.shhf = data.shhf
  reviewForm.shoujihaoma = data.shoujihaoma
  reviewForm.yishenggonghao = data.yishenggonghao
  reviewForm.yishengxingming = data.yishengxingming
  reviewForm.yonghuming = data.yonghuming
  reviewForm.yonghuxingming = data.yonghuxingming
  reviewForm.yuyueriqi = data.yuyueriqi
}
function handleView(row) {
  opType.value = 'view'
  dialogVisible.value = true
  window.sessionStorage.setItem('id', row.id)
  form.id = row.id
  form.chongwuming = row.chongwuming
  form.chongwuzhuangkuang = row.chongwuzhuangkuang
  form.keshimingcheng = row.keshimingcheng
  form.sfsh = row.sfsh || '否'
  form.shhf = row.shhf || ''
  form.shoujihaoma = row.shoujihaoma
  form.yishenggonghao = row.yishenggonghao
  form.yishengxingming = row.yishengxingming
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.yuyueriqi = row.yuyueriqi
}
function handleEdit(row) {
  window.sessionStorage.setItem('id', row.id)
  opType.value = 'edit'
  dialogVisible.value = true
  form.id = row.id
  form.chongwuming = row.chongwuming
  form.chongwuzhuangkuang = row.chongwuzhuangkuang
  form.keshimingcheng = row.keshimingcheng
  form.sfsh = row.sfsh
  form.shhf = row.shhf
  form.shoujihaoma = row.shoujihaoma
  form.yishenggonghao = row.yishenggonghao
  form.yishengxingming = row.yishengxingming
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.yuyueriqi = row.yuyueriqi
}
function handleDelete(row) {
  ElMessageBox.confirm('确认删除挂号信息？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log('Deleting user with ID:', row.id)
      await DeleteAppointment([row.id])
      fetchData()
    })
    .catch(() => {})
}
function handleBatchDelete() {
  const ids = multipleSelection.value.map((u) => u.id)
  ElMessageBox.confirm('确认删除挂号的医生信息？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await DeleteAppointment(ids)
      fetchData()
    })
    .catch(() => {})
}

// 关闭弹窗，重置表单
function onClose() {
  dialogVisible.value = false
  formRef.value && formRef.value.resetFields()
  form.id = ''
  form.chongwuzhuangkuang = ''
  form.keshimingcheng = ''
  form.sfsh = ''
  form.shhf = ''
  form.shoujihaoma = ''
  form.yishenggonghao = ''
  form.yishengxingming = ''
  form.yonghuming = ''
  form.yonghuxingming = ''
  form.yuyueriqi = ''
  window.sessionStorage.removeItem('id')
  opType.value = 'add'
}

function onReviewClose() {
  reviewDialogVisible.value = false
  reviewForm.chongwuming = ''
  reviewForm.chongwuzhuangkuang = ''
  reviewForm.keshimingcheng = ''
  reviewForm.sfsh = '否'
  reviewForm.shhf = ''
  reviewForm.shoujihaoma = ''
  reviewForm.yishenggonghao = ''
  reviewForm.yishengxingming = ''
  reviewForm.yonghuming = ''
  reviewForm.yonghuxingming = ''
  reviewForm.yuyueriqi = ''
}

// 提交表单
function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    form.yuyueriqi = dayjs(form.yuyueriqi).format('YYYY-MM-DD HH:mm:ss')
    try {
      if (opType.value === 'edit') {
        await UpdateAppointment(form)
        ElMessage.success('修改成功')
      } else {
        await AddAppointment(form)
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

const submitReviewForm = () => {
  reviewFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await UpdateAppointment(reviewForm)
      ElMessage.success('修改成功')

      onReviewClose()
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
