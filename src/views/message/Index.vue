<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">留言板管理</h3>

    <!-- 搜索与操作 -->
    <el-row :gutter="12" class="mb-4">
      <el-col :span="6">
        <el-input v-model="search.title" placeholder="用户名" clearable />
      </el-col>
      <el-col :span="12" class="flex items-center space-x-2">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button v-if="userStore.userInfo.role == '用户'" type="success" @click="openDialog('add')"
          >添加</el-button
        >
        <el-button
          v-if="userStore.role != '用户'"
          type="danger"
          :disabled="!selectedKnowledges.length"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button> </el-col
      >""
    </el-row>

    <el-table
      v-loading="loading"
      :data="messageList"
      border
      @selection-change="onSelectionChange"
      class="mb-4 pt-8"
    >
      <el-table-column type="selection" width="50" />
      <!-- userid: item.userid,
        username: item.username,
        content: item.content,
        reply: item.reply, -->
      <el-table-column prop="userid" label="用户id" width="120" sortable />
      <el-table-column prop="username" label="用户名" width="120" sortable />
      <el-table-column prop="content" label="内容" fit />
      <el-table-column prop="reply" label="回复" width="120" sortable />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
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
        <el-form-item prop="userid" label="用户id">
          <el-input v-model="form.userid" placeholder="请输入用户id" readonly />
        </el-form-item>

        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" readonly />
        </el-form-item>

        <el-form-item prop="content" label="内容">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item v-show="userStore.userInfo.role != '用户'" prop="reply" label="回复">
          <el-input v-model="form.reply" type="textarea" placeholder="请输入回复内容" />
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
import { GetMessageList, AddMessage, UpdateMessage, DeleteMessage } from '@/api/message'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const search = reactive({
  username: '',
})

const messageList = ref([])
const selectedKnowledges = ref([])
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const dialogVisible = ref(false)
const opType = ref('add') // 'add' | 'edit' | 'view'
const formRef = ref(null)
const form = reactive({
  id: '',
  userid: 0,
  username: '',
  content: '',
  reply: '',
})
const token = window.sessionStorage.getItem('token') || ''

const rules = {
 
}

const dialogTitle = computed(() => {
  if (opType.value === 'add') return '添加留言'
  if (opType.value === 'edit') return '编辑留言'
  return '查看留言'
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
    const res = await GetMessageList(params)
    if (res.code === 0) {
      console.log('留言板', res.data)
      messageList.value = res.data.list.map((item) => ({
        id: item.id,
        userid: item.userid,
        username: item.username,
        content: item.content,
        reply: item.reply,
      }))
      console.log('message list ', messageList.value)
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
    form.userid = userStore.userInfo.id
    form.username = userStore.userInfo.username
    form.content = ''
    form.reply = ''
    return
  } 
  Object.assign(form, { ...row })
}

async function submitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      if (opType.value === 'add') {
        await AddMessage(form)
        ElMessage.success('添加成功')
      } else {
        await UpdateMessage(form)
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
  await ElMessageBox.confirm('确认删除此留言？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteMessage([row.id])
  ElMessage.success('删除成功')
  fetchData()
}

async function handleBatchDelete() {
  const ids = selectedKnowledges.value.map((d) => d.id)
  await ElMessageBox.confirm('确认删除选中的留言？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await DeleteMessage(ids)
  ElMessage.success('批量删除成功')
  fetchData()
}
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
