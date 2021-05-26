const { mock } = require('mockjs')
const { handleRandomImage } = require('../utils')

const List = []
const count = 999
for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: '@uuid',
      id: '@id',
      title: '@cname', //商品名称
      'status|1': ['on', 'off'],
      author: '@cname', //厂商
      datetime: '@datetime',
      pageViews: '@integer(0, 5000)',
      img: handleRandomImage(200, 200),
      smallImg: handleRandomImage(40, 40),
      switch: '@boolean',
      price: '@integer(80,99)',
      saled: 0,
    })
  )
}

module.exports = [
  {
    url: '/table/getList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: List,
      }
    },
  },
  {
    url: '/table/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/table/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
  // 上下架
  {
    url: '/table/doOffOrOn',
    type: 'post',
    response(req) {
      console.log(req, 'req')
      return {
        code: 200,
        msg: '模拟上下架成功',
      }
    },
  },
  // 重置库存
  {
    url: '/table/resetStock',
    type: 'post',
    response(req) {
      console.log(req, 'req')
      return {
        code: 200,
        msg: '模拟重置库存成功',
      }
    },
  },
]
