<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h3 class="text-2xl font-semibold mb-4">订单信息管理</h3>

    <!-- 搜索与操作按钮 -->
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input v-model="search.orderId" placeholder="订单编号" />
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button v-if="userStore.userInfo.role != '用户'" type="success" @click="handleAdd">添加</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" @click="handleBatchDelete">
          批量删除
        </el-button>
        <el-button type="success" @click="handleStatistics">统计</el-button>
      </el-col>

    </el-row>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="orderList"
      border
      @selection-change="onSelectionChange"
      class="my-4 pt-8"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="dingdanbianhao" label="订单编号" sortable />
      <el-table-column prop="yaopinmingcheng" label="药品名称" sortable />
      <el-table-column prop="guige" label="规格" sortable />
      <el-table-column prop="shengchanshang" label="生产商" sortable />
      <el-table-column prop="shuliang" label="数量" />
      <el-table-column prop="jiage" label="价格" sortable />
      <el-table-column prop="zongjine" label="总金额" sortable />
      <el-table-column prop="yonghuming" label="用户名" sortable />
      <el-table-column prop="yonghuxingming" label="用户姓名" sortable />
      <el-table-column prop="ispay" label="是否支付" sortable >
        <template #default="{ row }">
          <template v-if="userStore.userInfo.role != '用户'">
            <span v-if="!row.ispay || row.ispay != '已支付'">未支付</span>
            <span v-else>已支付</span>
          </template>
          <template v-else>
          <el-button v-if="!row.ispay || row.ispay != '已支付'" type="danger" @click="openPayDialog(row)">支付</el-button>
          <template v-else>已支付</template>
        </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="info" @click="handleView(row)"> 查看 </el-button>
          <el-button v-if="userStore.userInfo.role != '用户'" type="warning" @click="handleEdit(row)"> 修改 </el-button>
          <el-button v-if="userStore.userInfo.role != '用户'" type="danger" @click="handleDelete(row)"> 删除 </el-button>
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
        :hide-required-asterisk="opType === 'view'"
      >
        <el-form-item prop="dingdanbianhao" label="订单编号">
          <el-input v-model="form.dingdanbianhao" placeholder="请输入订单编号" readonly />
        </el-form-item>
        <el-form-item v-if="opType === 'view'" prop="yaopinmingcheng" label="药品名称">
          <el-input
            v-model="form.yaopinmingcheng"
            placeholder="请输入药品名称"
            :readonly="opType === 'view'"
          />
        </el-form-item>
        <el-form-item v-else prop="yaopinmingcheng" label="药品名称">
          <el-select
            v-model="form.yaopinmingcheng"
            placeholder="请选择药品名称"
            @change="onMedicineChange"
          >
            <el-option
              v-for="item in medicineList"
              :key="item.id"
              :label="item.yaopinmingcheng"
              :value="item.yaopinmingcheng"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="guige" label="规格">
          <el-input v-model="form.guige" placeholder="请输入规格" readonly />
        </el-form-item>
        <el-form-item prop="shengchanshang" label="生产厂商">
          <el-input v-model="form.shengchanshang" placeholder="请输入生产厂商" readonly />
        </el-form-item>
        <el-form-item prop="shuliang" label="数量">
          <el-input
            v-model="form.shuliang"
            placeholder="请输入数量"
            type="number"
            min="0"
            :max="selectedMedicine.shuliang"
            :readonly="opType === 'view'"
            @input="calcTotal"
          />
        </el-form-item>
        <el-form-item prop="jiage" label="价格">
          <el-input v-model="form.jiage" placeholder="请输入价格" readonly />
        </el-form-item>
        <el-form-item prop="zongjine" label="总金额">
          <el-input v-model="form.zongjine" placeholder="请输入总金额" readonly />
        </el-form-item>
        <el-form-item prop="yonghuming" label="用户名">
          <el-input
            v-if="opType === 'view'"
            v-model="form.yonghuming"
            placeholder="请输入用户名"
            :readonly="opType === 'view'"
          />
          <el-select
            v-else
            v-model="form.yonghuming"
            placeholder="请选择用户名"
            @change="onUserChange"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.yonghuming"
              :value="item.yonghuming"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="yonghuxingming" label="用户姓名">
          <el-input
            v-model="form.yonghuxingming"
            placeholder="请输入用户姓名"
            :readonly="opType === 'view'"
          />
        </el-form-item>
        <el-form-item prop="ispay" label="是否支付">
          <el-input
            v-model="form.ispay"
            readonly
          />
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

    <!-- 支付对话框 -->
    <el-dialog
      :model-value="payDialogVisible"
      @close="onPayDialogClose"
      title="请选择支付方式"
      width="600px"
    >
      <div class="px-6 py-4">
        <form @submit.prevent="submitPay">
          <div class="grid grid-cols-2 gap-4">
            <label
              v-for="method in payMethods"
              :key="method.value"
              class="flex items-center space-x-2 p-2 border rounded-lg hover:border-blue-500 cursor-pointer"
            >
              <el-radio
                v-model="selected"
                :label="method.value"
                class="!m-0"
              />
              <img
                :src="method.img"
                :alt="method.label"
                class="h-20 w-32 object-contain"

              />
            </label>
          </div>

          <div class="flex justify-end mt-6">
            <el-button @click="onClose">取 消</el-button>
            <el-button
              type="primary"
              class="ml-2"
              :loading="loading"
              native-type="submit"
            >
              支 付
            </el-button>
          </div>
        </form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetOrderList, AddOrder, DeleteOrder, UpdateOrder } from '@/api/order'
import { GetMedicineList } from '@/api/medicine'
import { Pay } from "@/api/pay"
import { GetUserList } from '@/api/user'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import router from '@/router'


const userStore = useUserStore()

// 搜索条件
const search = reactive({
  orderId: '',
})

// 列表数据 & 分页
const orderList = ref([])
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
  dingdanbianhao: '',
  yaopinmingcheng: '',
  guige: '',
  shengchanshang: '',
  shuliang: 0,
  jiage: '',
  zongjine: 0,
  yonghuming: '',
  yonghuxingming: '',
  ispay: '',
})
const statisticsVisible = ref(false)

const handleStatistics = () => {
  router.push({ path: '/statistics'})
}

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

  if (search.orderId != undefined && search.orderId != '') {
    params.dingdanbianhao = search.orderId
  }


  try {
    const res = await GetOrderList({
      page: page.value,
      limit: pageSize.value,
      sort: '',
      order: '',
    })
    console.log(res)
    if (res.code === 0) {
      orderList.value = res.data.records.map((item) => ({
        id: item.id,
        dingdanbianhao: item.dingdanbianhao,
        yaopinmingcheng: item.yaopinmingcheng,
        guige: item.guige,
        shengchanshang: item.shengchanshang,
        shuliang: item.shuliang,
        jiage: item.jiage,
        zongjine: item.zongjine,
        yonghuming: item.yonghuming,
        yonghuxingming: item.yonghuxingming,
        ispay: item.ispay || '未支付',
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

const medicineList = ref([])
const userList = ref([])

const calcTotal = () => {
  const price = parseFloat(form.jiage) || 0
  form.zongjine = price * (form.shuliang || 0)
}

function handleAdd() {
  form.id = ''
  // 跳转到新增页面
  dialogVisible.value = true


  form.dingdanbianhao = Math.round(new Date().getTime() / 1000)

  // 获取药品列表
  GetMedicineList({
    page: 1,
    limit: 100,
    sort: '',
    order: '',
  }).then((res) => {
    medicineList.value = res.data.list.map((item) => ({
      id: item.id,
      yaopinmingcheng: item.yaopinmingcheng,
      tupian: item.tupian,
      guige: item.guige,
      shengchanshang: item.shengchanshang,
      shuliang: item.shuliang,
      jiage: item.jiage,
      yaopinxiangqing: item.yaopinxiangqing,
    }))
  })

  // 获取用户列表
  GetUserList({
    page: 1,
    limit: 100,
    sort: '',
    order: '',
  }).then((res) => {
    userList.value = res.data.list.map((item) => ({
      id: item.id,
      yonghuming: item.yonghuming,
        mima: item.mima,
        yonghuxingming: item.yonghuxingming,
        avatar: item.touxiang,
        gender: item.xingbie,
        phone: item.shoujihaoma,
    }))
  })
}
function handleView(row) {
  opType.value = 'view'
  dialogVisible.value = true
  window.sessionStorage.setItem('id', row.id)
  form.id = row.id
  form.dingdanbianhao = row.dingdanbianhao
  form.yaopinmingcheng = row.yaopinmingcheng
  form.guige = row.guige
  form.shengchanshang = row.shengchanshang
  form.shuliang = row.shuliang
  form.jiage = row.jiage
  form.zongjine = row.zongjine
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.ispay = row.ispay || '未支付'
}
function handleEdit(row) {
  window.sessionStorage.setItem('id', row.id)
  opType.value = 'edit'
  dialogVisible.value = true
  form.id = row.id
  form.dingdanbianhao = row.dingdanbianhao
  form.yaopinmingcheng = row.yaopinmingcheng
  form.guige = row.guige
  form.shengchanshang = row.shengchanshang
  form.shuliang = row.shuliang
  form.jiage = row.jiage
  form.zongjine = row.zongjine
  form.yonghuming = row.yonghuming
  form.yonghuxingming = row.yonghuxingming
  form.ispay = row.ispay || '未支付'
}
function handleDelete(row) {
  ElMessageBox.confirm('确认删除此订单？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log('Deleting user with ID:', row.id)
      await DeleteOrder([row.id])
      fetchData()
    })
    .catch(() => {})
}

const selectedMedicine = ref({})

const onMedicineChange = (selectedName) => {
  const medicine = medicineList.value.find(item => item.yaopinmingcheng === selectedName)
  if (!medicine) return

  selectedMedicine.value = medicine
  // 把对应字段填进 form
  form.guige          = medicine.guige
  form.shengchanshang = medicine.shengchanshang
  form.jiage          = medicine.jiage
}

const onUserChange = (selectedName) => {
  const user = userList.value.find(item => item.yonghuming === selectedName)
  if (!user) return

  // 把对应字段填进 form
  form.yonghuxingming = user.yonghuxingming
}
function handleBatchDelete() {
  const ids = multipleSelection.value.map((u) => u.id)
  ElMessageBox.confirm('确认删除选中的订单？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await DeleteOrder(ids)
      fetchData()
    })
    .catch(() => {})
}

// 关闭弹窗，重置表单
function onClose() {
  dialogVisible.value = false
  formRef.value && formRef.value.resetFields()
  form.id = ''
  form.dingdanbianhao = ''
  form.yaopinmingcheng = ''
  form.guige = ''
  form.shengchanshang = ''
  form.shuliang = ''
  form.jiage = ''
  form.zongjine = ''
  form.yonghuming = ''
  form.yonghuxingming = ''
  form.ispay = ''
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
        await UpdateOrder(form)
        ElMessage.success('修改成功')
      } else {
        await AddOrder(form)
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

const payDialogVisible = ref(false)
const payMethods = [
  {
    value: 'wx',
    label: '微信支付',
    img: '/resources/images/bank/微信支付.png',
  },
  {
    value: 'ali',
    label: '建设银行',
    img: '/resources/images/bank/中国建设银行.png',
  },
  {
    value: 'boc',
    label: '中国银行',
    img: '/resources/images/bank/中国银行.png',
  },
  {
    value: 'abc',
    label: '中国农业银行',
    img: '/resources/images/bank/中国农业银行.png',
  },
  {
    value: 'cmb',
    label: '招商银行',
    img: '/resources/images/bank/招商银行.png',
  },
]
const selected = ref('wx') 
const paySelected = ref()

const openPayDialog = (select) => {
  payDialogVisible.value = true
  paySelected.value = select
}

const onPayDialogClose = () => {
  payDialogVisible.value = false
  selected.value = 'wx'
  paySelected.value = null
  form.id = ''
}

const submitPay = async () => {
  if (!selected.value) {
    ElMessage.warning('请先选择支付方式')
    return
  }
  loading.value = true
  try {
    const res = await Pay(paySelected.value.id, '已支付')
    if (res.code !== 0) {
      ElMessage.error(res.msg)
      return
    }
    ElMessage.success('支付成功')
    onPayDialogClose()
    fetchData()
  } catch (err) {
    ElMessage.error(err.response?.data?.msg || '支付失败')
  } finally {
    loading.value = false
  }
}

// 首次加载
onMounted(fetchData)
</script>

<style scoped>
/* TailwindCSS 提供绝大部分样式 */
</style>
