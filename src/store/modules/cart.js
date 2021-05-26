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
    state.addedList = addedList
  },
  addCartItem(state, item) {
    // state.addedList.some(e => e.uuid === item.uuid) ? 
    const index = state.addedList.indexOf(item)
    ~index ? state.addedList[index] = item : state.addedList.push(item)
  },
  delCartItem(state, item) {
    const index = state.addedList.indexOf(item)
    ~index && state.addedList.splice(index, 1)
    // state.addedList.delete(item)
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
