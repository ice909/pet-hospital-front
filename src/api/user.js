import http from '@/utils/http.js'

// 用户登录
export const Login = (tableName, role, username, password) => {
  const formData = new FormData()
  formData.append('chk', role)
  formData.append('username', username)
  formData.append('password', password)
  return http.request({
    url: `/${tableName}/login`,
    method: 'POST',
    data: formData,
  })
}

// 用户信息
export const GetUserInfo = (tableName) => {
  return http.request({
    url: `/${tableName}/info`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
    },
  })
}

// 修改密码
export const UpdatePassword = (tableName, oldPassword, newPassword) => {
  const formData = new FormData()
  formData.append('oldPassword', oldPassword)
  formData.append('newPassword', newPassword)
  return http.request({
    url: `/${tableName}/update/password`,
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
    },
  })
}

// 用户列表
export const GetUserList = ({ page, limit, sort, order, yonghuming, yonghuxingming }) => {
  return http.request({
    url: `/yonghu/page`,
    method: 'GET',
    params: {
      page,
      limit,
      sort,
      order,
      yonghuming,
      yonghuxingming,
    },
  })
}

// 添加用户
export const AddUser = (formData) => {
  return http.request({
    url: `/yonghu/save`,
    method: 'POST',
    data: formData,
  })
}

export const UpdateUser = (formData) => {
  return http.request({
    url: `/yonghu/update`,
    method: 'POST',
    data: formData,
  })
}

// 删除用户
export const DeleteUser = (ids) => {
  return http.request({
    url: `/yonghu/delete`,
    method: 'POST',
    data: ids,
  })
}
