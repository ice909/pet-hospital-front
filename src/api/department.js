import http from '@/utils/http.js'

export const GetDepartmentList = ({ page, limit, sort, order, yonghuming, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/keshixinxi/page`,
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
  })
}

export const AddDepartment = (formData) => {
  return http.request({
    url: `/keshixinxi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateDepartment = (formData) => {
  return http.request({
    url: `/keshixinxi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteDepartment = (ids) => {
  return http.request({
    url: `/keshixinxi/delete`,
    method: 'POST',
    data: ids,
  })
}