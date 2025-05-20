import http from '@/utils/http.js'

export const GetMessageList = ({ page, limit, sort, order, username }) => {
  return http.request({
    url: `/messages/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      username,
    },
    headers: {
      'X-User-ID': window.sessionStorage.getItem('userId'),
    }
  })
}

export const AddMessage = (formData) => {
  return http.request({
    url: `/messages/add`,
    method: 'POST',
    data: formData,
    headers: {
      'X-User-ID': window.sessionStorage.getItem('userId'),
    }
  })
}


export const UpdateMessage = (formData) => {
  return http.request({
    url: `/messages/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteMessage = (ids) => {
  return http.request({
    url: `/messages/delete`,
    method: 'POST',
    data: ids,
  })
}