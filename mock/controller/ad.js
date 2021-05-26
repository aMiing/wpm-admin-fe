/**
 * data: [{
 * title: 文本
 * url: 链接
 * }]
 */
const data = []
module.exports = [{
  url: '/ad/getList',
  type: 'get',
  response() {
    return {
      code: 200,
      msg: 'success',
      data,
    }
  },
}, ]
