/**
 * @author amingxiansen
 * @description  购物车状态
 */

const state = () => ({
  addedList: [],
})
const getters = {
  getCartList: (state) => state.addedList,
}

const mutations = {
  setCartList(state, addedList) {
    state.addedList = addedList.filter(e => Number(e.stock) > 0)
  },
  addCartItem(state, item) {
    let findIndex = -1;
    state.addedList.forEach((e, index) => {
      if(e.uuid === item.uuid) findIndex = index;
    })
    ~findIndex ? state.addedList[findIndex] = item : state.addedList.unshift(item)
  },
  delCartItem(state, item) {
    let findIndex = -1;
    state.addedList.forEach((e, index) => {
      if(e.uuid === item.uuid) findIndex = index;
    })
    ~findIndex && state.addedList.splice(findIndex, 1)
  },
  clearCartlist(state) {
    state.addedList.forEach(e => {
      e.saled = 0;
    })
    state.addedList = []
  }
}
const actions = {
  setCartList({ commit }, addedList) {
    commit('setCartList', addedList)
  },
}
export default { state, getters, mutations, actions }
