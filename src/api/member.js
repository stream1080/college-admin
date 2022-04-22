import request from '@/utils/request'

export default{

  list() {
    return request({
      url: '/admin/ucenter/member/list',
      method: 'get'
    })
  },

  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/ucenter/member/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  disableById(id) {
    return request({
      url: `/admin/ucenter/member/disable/${id}`,
      method: 'delete'
    })
  },

  availableById(id) {
    return request({
      url: `/admin/ucenter/member/available/${id}`,
      method: 'delete'
    })
  },

  batchRemove(idList) {
    return request({
      url: '/admin/ucenter/member/batch-remove',
      method: 'delete',
      data: idList
    })
  },

  save(member) {
    return request({
      url: '/admin/ucenter/member/save',
      method: 'post',
      data: member
    })
  },

  getById(id) {
    return request({
      url: `/admin/ucenter/member/get/${id}`,
      method: 'get'
    })
  },

  updateById(member) {
    return request({
      url: `/admin/ucenter/member/update`,
      method: 'put',
      data: member
    })
  },

  selectNameListByKey(key) {
    return request({
      url: `/admin/ucenter/member/list/name/${key}`,
      method: 'get'
    })
  }
}
