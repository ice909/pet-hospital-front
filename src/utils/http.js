import axios from 'axios'

const server = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
})
// 请求拦截器
server.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    Promise.reject(err)
  },
)

// 响应拦截器
server.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default server
