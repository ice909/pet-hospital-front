import http from '@/utils/http.js'

export const GetKnowledgeList = ({ page, limit, sort, order, yishenggonghao, yishengxingming }) => {
  return http.request({
    url: `/yixuezhishi/page`,
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

export const AddKnowledge = (formData) => {
  return http.request({
    url: `/yixuezhishi/add`,
    method: 'POST',
    data: formData,
  })
}


export const UpdateKnowledge = (formData) => {
  return http.request({
    url: `/yixuezhishi/update`,
    method: 'POST',
    data: formData,
  })
}

export const DeleteKnowledge = (ids) => {
  return http.request({
    url: `/yixuezhishi/delete`,
    method: 'POST',
    data: ids,
  })
}