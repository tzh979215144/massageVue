import request from '@/utils/request'
export function getGuests() {
  return request({
    url: 'api/guest',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/guest',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/guest/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/guest',
    method: 'put',
    data
  })
}

export default { add, edit, del }
