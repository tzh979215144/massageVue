import request from '@/utils/request'

export function getWorkMassagers(data) {
  return request({
    url: 'api/massagerAllot/workMassagers',
    method: 'put',
    data
  })
}

export function getGiftVouchersTotal(data) {
  return request({
    url: 'api/massagerAllot/giftVouchers',
    method: 'put',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/shopMassager',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/shopMassager/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/shopMassager',
    method: 'put',
    data
  })
}


export function updateWage(data) {
  return request({
    url: 'api/wage/update',
    method: 'put',
    data
  })
}
export default { add, edit, del }
