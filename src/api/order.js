import http from '@/utils/http.js'

export const GetOrderList = ({ page, limit, sort, order, dingdanbianhao }) => {
  return http.request({
    url: `/dingdanxinxi/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      dingdanbianhao,
    },
    headers: {
      'X-Table-Name': window.sessionStorage.getItem('tableName'),
      'X-UserName': window.sessionStorage.getItem('username'),
    }
  })
}

export const AddOrder = (formData) => {
  return http.request({
    url: `/dingdanxinxi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateOrder = (formData) => {
  return http.request({
    url: `/dingdanxinxi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteOrder = (ids) => {
  return http.request({
    url: `/dingdanxinxi/delete`,
    method: 'POST',
    data: ids,
  })
}