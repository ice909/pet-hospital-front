<template>
  <div v-if="userStore.userInfo.role != '用户'" class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">医学知识管理</h3>

    <!-- 搜索与操作 -->
    <el-row :gutter="12" class="mb-4">
      <el-col :span="6">
        <el-input v-model="search.title" placeholder="文章标题" clearable />
      </el-col>
      <el-col :span="12" class="flex items-center space-x-2">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="success" @click="openDialog('add')">添加</el-button>
        <el-button type="danger" :disabled="!selectedKnowledges.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="knowledgeList"
      border
      @selection-change="onSelectionChange"
      class="mb-4 pt-8"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="wenzhangbiaoti" label="文章标题" width="120" sortable />
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <img :src="row.tupian" :width="100" :height="100" />
        </template>
      </el-table-column>
      <el-table-column prop="wenzhangneirong" label="文章内容" fit />
      <el-table-column prop="faburiqi" label="发布日期" width="120" sortable />
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
        <el-form-item prop="wenzhangbiaoti" label="文章标题">
          <el-input v-model="form.wenzhangbiaoti" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item prop="wenzhangneirong" label="文章内容">
          <el-input v-model="form.wenzhangneirong" type="textarea" placeholder="请输入文章内容" />
        </el-form-item>

        <el-form-item prop="tupian" label="文章图片">
          <div class="flex items-center gap-4">
            <img v-if="form.tupian" :src="form.tupian" :width="100" :height="100" />
            <el-upload
              action="/api/file/upload"
              v-if="opType !== 'view'"
              :headers="{ Authorization: `Bearer ${token}` }"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <el-button>上传图片</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-input
            v-model="form.faburiqi"
            type="date"
            placeholder="请选择发布日期" />
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
  <div v-else>
    <h3 class="text-2xl font-semibold mb-4">医学知识</h3>
    <el-table
      v-loading="loading"
      :data="knowledgeList"
      border
      class="mb-4 pt-8"
    >
      <el-table-column prop="wenzhangbiaoti" label="文章标题" width="120" sortable />
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <img :src="row.tupian" :width="100" :height="100" />
        </template>
      </el-table-column>
      <el-table-column prop="wenzhangneirong" label="文章内容" fit />
      <el-table-column prop="faburiqi" label="发布日期" width="120" sortable />
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetKnowledgeList, AddKnowledge, UpdateKnowledge, DeleteKnowledge } from '@/api/knowledge'
import { useUserStore } from '@/stores/user'


const userStore = useUserStore()

const search = reactive({
  title: '',
})

const knowledgeList = ref([])
const selectedKnowledges = ref([])
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const dialogVisible = ref(false)
const opType = ref('add') // 'add' | 'edit' | 'view'
const formRef = ref(null)
const form = reactive({
  id: '',
  wenzhangbiaoti: '',
  wenzhangneirong: '',
  tupian: '',
  faburiqi: '',
})
const token = window.sessionStorage.getItem('token') || ''

const rules = {
  wenzhangbiaoti: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  wenzhangneirong: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
  faburiqi: [
    {
      type: 'date',
      required: true,
      message: '请选择发布日期',
      trigger: 'change',
    },
  ],
}

const dialogTitle = computed(() => {
  if (opType.value === 'add') return '添加医学知识'
  if (opType.value === 'edit') return '编辑医学知识'
  return '查看医学知识'
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

  if (search.title != undefined && search.title != '') {
    params.title = search.title
  }

  try {
    const res = await GetKnowledgeList(params)
    if (res.code === 0) {
      console.log('医学知识', res.data)
      knowledgeList.value = res.data.list.map((item) => ({
        id: item.id,
        wenzhangbiaoti: item.wenzhangbiaoti,
        tupian: item.tupian,
        wenzhangneirong: item.wenzhangneirong,
        faburiqi: item.faburiqi,
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
  selectedKnowledges.value = val
}

function openDialog(type, row = null) {
  opType.value = type
  dialogVisible.value = true
  console.log(row)
  if (type === 'add') {
    Object.assign(form, {
      id: '',
      wenzhangbiaoti: '',
      wenzhangneirong: '',
      tupian: '',
      faburiqi: '',
    })
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
        await AddKnowledge(form)
        ElMessage.success('添加成功')
      } else {
        await UpdateKnowledge(form)
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
  form.tupian = 'http://127.0.0.1:8081/jspmjl5mx/upload/' + res.file
}

function resetDialog() {
  dialogVisible.value = false
  formRef.value?.resetFields()
  form.id = ''
  ;(form.wenzhangbiaoti = ''),
    (form.wenzhangneirong = ''),
    (form.tupian = ''),
    (form.faburiqi = ''),
    (selectedKnowledges.value = [])
  opType.value = 'add'
  window.sessionStorage.removeItem('id')
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确认删除此医生？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteKnowledge([row.id])
  ElMessage.success('删除成功')
  fetchData()
}

async function handleBatchDelete() {
  const ids = selectedKnowledges.value.map((d) => d.id)
  await ElMessageBox.confirm('确认删除选中医生？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteKnowledge(ids)
  ElMessage.success('批量删除成功')
  fetchData()
}
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
