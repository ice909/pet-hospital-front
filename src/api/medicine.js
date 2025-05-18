import http from '@/utils/http.js'

export const GetMedicineList = ({ page, limit, sort, order, yaopinmingcheng }) => {
  return http.request({
    url: `/yaopinxinxi/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      yaopinmingcheng,
    },
  })
}

export const AddMedicine = (formData) => {
  return http.request({
    url: `/yaopinxinxi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateMedicine = (formData) => {
  return http.request({
    url: `/yaopinxinxi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteMedicine = (ids) => {
  return http.request({
    url: `/yaopinxinxi/delete`,
    method: 'POST',
    data: ids,
  })
}