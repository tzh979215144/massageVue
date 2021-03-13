import request from '@/utils/request'

export function getMassagers(data) {
  return request({
    url: 'api/massager/all',
    method: 'get',
    data
  })
}
export function get(data) {
  return request({
    url: 'api/massager',
    method: 'get',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/massager',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/massager',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/massager',
    method: 'put',
    data
  })
}

export default { add, edit, del }
