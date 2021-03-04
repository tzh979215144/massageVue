import request from '@/utils/request'

export function confirm(data) {
  return request({
    url: '/api/massageBooking/confirm',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/massageBooking',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/massageBooking/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/massageBooking',
    method: 'put',
    data
  })
}

export default { add, edit, del }
