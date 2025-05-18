import http from '@/utils/http.js'

export const Pay = (orderId, payType) => {
  return http.request({
    url: `/dingdanxinxi/update`,
    method: 'POST',
    data: JSON.stringify({ id: orderId, ispay: payType }),
    headers: {
      'Content-Type': 'application/json',
      'token': window.sessionStorage.getItem('token')
    }
  })
}