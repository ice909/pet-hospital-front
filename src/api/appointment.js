import http from '@/utils/http.js'

export const GetAppointmentList = ({ page, limit, sort, order, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/yuyueguahao/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      yishenggonghao,
      yishengxingming,
    },
    headers: {
      'X-Table-Name': window.sessionStorage.getItem('tableName'),
      'X-Username': window.sessionStorage.getItem('username'),
    },
  })
}

export const AddAppointment = (formData) => {
  return http.request({
    url: `/yuyueguahao/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateAppointment = (formData) => {
  return http.request({
    url: `/yuyueguahao/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteAppointment = (ids) => {
  return http.request({
    url: `/yuyueguahao/delete`,
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