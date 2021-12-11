/**
 * @author 
 * @description 代码生成机状态管理
 */
import {
  getList
} from '@/api/order'

const state = () => ({
  orderList: [],
  currentOrderList: [],
  total: 0,
  queue: 0, //排队号，本地记录
})
const getters = {
  getOrderList: (state) => state.orderList,
  getFiltList: (state) => state.currentOrderList,
  getTotal: state => state.total,
  getQueue: state => state.queue,
}

const mutations = {
  setQueue(state) {
    state.queue++;
  },
  setOrderList(state, orderList) {
    state.orderList = orderList
  },
  addGoodsItem(state, item) {
    let index = -1;
    state.orderList.forEach((e, ind) => {
      if (e.uuid === item.uuid) {
        index = ind
      }
    });
    ~index ? state.orderList[index] = item : state.orderList.unshift(item)
  },
  getFilterData(state, config) {
    const {
      title = '', pageNo = 1, pageSize = 20
    } = config
    let mockList = title ? state.orderList.filter((item) => {
      return ~(item.name + item.orderId).indexOf(title)
    }) : state.orderList;
    const pageList = mockList.filter((item, index) =>
      index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
    )
    state.currentOrderList = pageList;
    state.total = mockList.length;
  }
}
const actions = {
  async setOrderList({
    commit
  }, config) {
    // 请求数据
    const {
      data
    } = await getList(config || [])
    commit('setOrderList', data)
    commit('getFilterData', {})
  },
  getSalesPreview({
    commit
  }) {

    commit()
  }
  // addGoodsItem({
  //   commit
  // }, list) {
  //   commit('addGoodsItem', list)
  //   commit('getFilterData', {
  //     title: ""
  //   })
  // },
}


export default {
  state,
  getters,
  mutations,
  actions
}