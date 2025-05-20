<template>
  <div ref="chartContainer" style="width: 1200px; height: 400px;"></div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { GetOrderList,} from '@/api/order'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue';

const orderList = ref([])
const chartContainer = ref(null);
let chartInstance = null;

onMounted(async () => {
  let params = {
    page: 1,
    limit: 100,
    sort: '',
    order: '',
  }

  try {
    const res = await GetOrderList(params)
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
    } else if (res.code === 401) {
      window.location.replace('/login')
    } else {
      ElMessage.error('获取列表失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '网络错误')
  } 
  chartInstance = echarts.init(chartContainer.value);
  const option = {
    title: {
      text: '药品订单金额统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: orderList.value.map(item => item.yaopinmingcheng),
      axisLabel: {
        rotate: 30 // 如果药品名太长可以旋转
      }
    },
    yAxis: {
      type: 'value',
      name: '总金额 (元)'
    },
    series: [
      {
        name: '订单金额',
        type: 'bar',
        data: orderList.value.map(item => item.zongjine),
        itemStyle: {
          color: '#5470c6' // 设置柱状图颜色
        },
        label: {
          show: true,
          position: 'top' // 在柱子上方显示金额
        }
      }
    ]
  };
  chartInstance.setOption(option);

})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
})

</script>