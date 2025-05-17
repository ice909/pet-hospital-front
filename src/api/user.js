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
export const GetUserInfo = () => {
  return http.request({
    url: `/users/info`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
    }
  })
}
