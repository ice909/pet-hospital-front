<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">医生管理</h3>

    <!-- 搜索与操作 -->
    <el-row :gutter="12" class="mb-4">
      <el-col :span="6">
        <el-input v-model="search.employeeNumber" placeholder="医生工号" clearable />
      </el-col>
      <el-col :span="6">
        <el-input v-model="search.name" placeholder="医生姓名" clearable />
      </el-col>
      <el-col :span="12" class="flex items-center space-x-2">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="success" @click="openDialog('add')">添加</el-button>
        <el-button type="danger" :disabled="!selectedDoctors.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 医生列表 -->
    <el-table
      v-loading="loading"
      :data="doctorList"
      border
      @selection-change="onSelectionChange"
      class="mb-4 pt-8"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="yishenggonghao" label="医生工号" width="120" sortable />
      <el-table-column prop="yishengxingming" label="姓名" sortable />
      <el-table-column label="头像" width="100">
        <template #default="{ row }">
          <img :src="row.touxiang" :width="100" :height="100" />
        </template>
      </el-table-column>
      <el-table-column prop="xingbie" label="性别" width="80" sortable />
      <el-table-column prop="lianxifangshi" label="手机" width="140" sortable />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button type="info" @click="openDialog('view', row)">查看</el-button>
          <el-button type="warning" @click="openDialog('edit', row)">修改</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：添加 / 编辑 / 查看 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :before-close="resetDialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="opType === 'view'"
        :hide-required-asterisk="opType === 'view'"
        class="space-y-4"
      >
        <el-form-item prop="yishenggonghao" label="医生工号">
          <el-input v-model="form.yishenggonghao" placeholder="请输入医生工号" />
        </el-form-item>

        <el-form-item prop="mima" label="密码">
          <el-input v-model="form.mima" placeholder="请输入医生密码" type="password" />
        </el-form-item>

        <el-form-item prop="yishengxingming" label="医生姓名">
          <el-input v-model="form.yishengxingming" placeholder="请输入医生姓名" />
        </el-form-item>

        <el-form-item prop="touxiang" label="头像">
          <div class="flex items-center gap-4">
            <img v-if="form.touxiang" :src="form.touxiang" :width="100" :height="100" />
            <el-upload
              action="/api/file/upload"
              v-if="opType !== 'view'"
              :headers="{ Authorization: `Bearer ${token}` }"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <el-button>上传头像</el-button>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item prop="xingbie" label="性别">
          <el-select v-model="form.xingbie" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>

        <el-form-item prop="lianxifangshi" label="手机号码">
          <el-input v-model="form.lianxifangshi" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button v-if="opType !== 'view'" @click="resetDialog">取消</el-button>
          <el-button v-if="opType !== 'view'" type="primary" :loading="loading" @click="submitForm">
            提交
          </el-button>
          <el-button v-else @click="resetDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetDoctorList, AddDoctor, UpdateDoctor, DeleteDoctor } from '@/api/doctor'

const search = reactive({
  employeeNumber: '',
  name: '',
})

const doctorList = ref([])
const selectedDoctors = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const dialogVisible = ref(false)
const opType = ref('add') // 'add' | 'edit' | 'view'
const formRef = ref(null)
const form = reactive({
  id: '',
  yishenggonghao: '',
  mima: '',
  yishengxingming: '',
  touxiang: '',
  xingbie: '',
  lianxifangshi: '',
})
const token = window.sessionStorage.getItem('token') || ''

const rules = {
  yishenggonghao: [{ required: true, message: '请输入医生工号', trigger: 'blur' }],
  mima: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  xingbie: [{ required: true, message: '请选择性别', trigger: 'change' }],
  yishengxingming: [{ required: true, message: '请输入医生姓名', trigger: 'blur' }],
  touxiang: [{ required: true, message: '请上传医生头像', trigger: 'change' }],
  lianxifangshi: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur',
    },
  ],
}

const dialogTitle = computed(() => {
  if (opType.value === 'add') return '添加医生'
  if (opType.value === 'edit') return '编辑医生'
  return '查看医生'
})

// 拉取列表
async function fetchData() {
  loading.value = true
  let params = {
    page: page.value,
    limit: pageSize.value,
    sort: '',
    order: '',
  }

  if (search.employeeNumber != undefined && search.employeeNumber != '') {
    params.yishenggonghao = search.employeeNumber
  }

  if (search.name != undefined && search.name != '') {
    params.yishengxingming = search.name
  }
  try {
    const res = await GetDoctorList(params)
    if (res.code === 0) {
      console.log('医生列表', res.data)
      doctorList.value = res.data.list.map((item) => ({
        id: item.id,
        yishenggonghao: item.yishenggonghao,
        mima: item.mima,
        yishengxingming: item.yishengxingming,
        touxiang: item.touxiang,
        xingbie: item.xingbie,
        lianxifangshi: item.lianxifangshi,
      }))
    } else {
      ElMessage.error(res.msg || '列表加载失败')
    }
  } catch {
    ElMessage.error('网络错误')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

function handleSearch() {
  page.value = 1
  fetchData()
}

function onSelectionChange(val) {
  selectedDoctors.value = val
}

function openDialog(type, row = null) {
  opType.value = type
  dialogVisible.value = true
  if (type === 'add') {
    Object.assign(form, { id: '', name: '', department: '', avatar: '', gender: '', phone: '' })
  } else {
    Object.assign(form, { ...row })
  }
}

async function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (opType.value === 'add') {
        await AddDoctor(form)
        ElMessage.success('添加成功')
      } else {
        await UpdateDoctor(form)
        ElMessage.success('更新成功')
      }
      resetDialog()
      fetchData()
    } catch {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

const handleUploadSuccess = (res) => {
  form.touxiang = 'http://127.0.0.1:8081/jspmjl5mx/upload/' + res.file
}

function resetDialog() {
  dialogVisible.value = false
  formRef.value?.resetFields()
  form.id = ''
  form.yishenggonghao = ''
  form.mima = ''
  form.yishengxingming = ''
  form.touxiang = ''
  form.xingbie = ''
  form.lianxifangshi = ''
  selectedDoctors.value = []
  opType.value = 'add'
  window.sessionStorage.removeItem('id')
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确认删除此医生？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteDoctor([row.id])
  ElMessage.success('删除成功')
  fetchData()
}

async function handleBatchDelete() {
  const ids = selectedDoctors.value.map((d) => d.id)
  await ElMessageBox.confirm('确认删除选中医生？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteDoctor(ids)
  ElMessage.success('批量删除成功')
  fetchData()
}
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
