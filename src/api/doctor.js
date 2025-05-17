import http from '@/utils/http.js'

export const GetDoctorList = ({ page, limit, sort, order, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/yisheng/page`,
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
    url: `/yisheng/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateDoctor = (formData) => {
  return http.request({
    url: `/yisheng/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteDoctor = (ids) => {
  return http.request({
    url: `/yisheng/delete`,
    method: 'POST',
    data: ids,
  })
}