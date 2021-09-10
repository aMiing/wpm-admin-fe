/**
 * @author amingxiansen
 * @description  购物车状态
 */

const state = () => ({
  addedList: [],
  discount: 1,
  changedPrice: '',
  orderCache: [], //挂起订单
})
const getters = {
  getCartList: (state) => state.addedList,
  getDiscount: (state) => state.discount,
  getChangedPrice: (state) => state.changedPrice,
  getOrderCache: (state) => state.orderCache,
}

const mutations = {
  setCartList(state, addedList) {
    state.addedList = addedList.filter(e => Number(e.stock) > 0)
  },
  setDiscount(state, val) {
    state.discount = val / 100;
  },
  setChangedPrice(state, val) {
    state.changedPrice = val;
  },
  addOrderCache(state) {
    state.orderCache.push({
      time: new Date().getTime(),
      list: JSON.stringify(state.addedList)
    })
  },
  delOrderCache(state, item) {
    let findIndex = -1;
    state.orderCache.forEach((e, index) => {
      if (e.time === item.time) findIndex = index;
    });
    ~findIndex && state.orderCache.splice(findIndex, 1)
  },
  clearAllCache(state) {
    state.orderCache = []
  },

  addCartItem(state, item) {
    let findIndex = -1;
    state.addedList.forEach((e, index) => {
      if (e.uuid === item.uuid) findIndex = index;
    });
    ~findIndex ? state.addedList[findIndex] = item : state.addedList.unshift(item)
  },
  delCartItem(state, item) {
    let findIndex = -1;
    state.addedList.forEach((e, index) => {
      if (e.uuid === item.uuid) findIndex = index;
    });
    ~findIndex && state.addedList.splice(findIndex, 1)
  },
  clearCartlist(state, params) {
    state.addedList.forEach(e => {
      // 恢复库存
      params && params.recoveryStock && (e.stock += e.saled);
      e.saled = 0;
    })
    state.addedList = []
    state.changedPrice = ''
    state.discount = 1
  }
}
const actions = {
  setCartList({
    commit
  }, addedList) {
    commit('setCartList', addedList)
  },
}
export default {
  state,
  getters,
  mutations,
  actions
}