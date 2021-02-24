import request from '@/utils/request'

export function addFromBooking(data) {
  return request({
    url: 'api/massageRecord',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/massageRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/massageRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/massageRecord',
    method: 'put',
    data
  })
}

export default { add, edit, del }
