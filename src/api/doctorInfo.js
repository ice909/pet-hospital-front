import http from '@/utils/http.js'

export const GetDoctorList = ({ page, limit, sort, order, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/yishengxinxi/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      yishenggonghao,
      yishengxingming,
    },
  })
}

export const AddDoctor = (formData) => {
  return http.request({
    url: `/yishengxinxi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateDoctor = (formData) => {
  return http.request({
    url: `/yishengxinxi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteDoctor = (ids) => {
  return http.request({
    url: `/yishengxinxi/delete`,
    method: 'POST',
    data: ids,
  })
}