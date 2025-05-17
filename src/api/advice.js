import http from '@/utils/http.js'

export const GetAdviceList = ({ page, limit, sort, order,yonghuming, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/yizhuxinxi/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      yonghuming,
      yishenggonghao,
      yishengxingming,
    },
    headers: {
      'X-Table-Name': window.sessionStorage.getItem('tableName')
    }
  })
}

export const AddAdvice = (formData) => {
  return http.request({
    url: `/yizhuxinxi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateAdvice = (formData) => {
  return http.request({
    url: `/yizhuxinxi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteAdvice = (ids) => {
  return http.request({
    url: `/yizhuxinxi/delete`,
    method: 'POST',
    data: ids,
  })
}

export const AppointmentInfo = (id) => {
  return http.request({
    url: `/yuyueguahao/info/${id}`,
    method: 'GET'
  })
}