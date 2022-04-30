/**
 * @author amingxiansen
 * @description 全局状态管理
 */

const state = () => ({
  AllProductionsList: [],
});
const getters = {
  getAllProductionsList: state => state.AllProductionsList,
};

const mutations = {
  setAllProductionsList(state, AllProductionsList) {
    state.AllProductionsList = AllProductionsList;
  },
};
const actions = {
  setAllProductionsList({ commit }, AllProductionsList) {
    commit('setCartList', AllProductionsList);
  },
};
export default { state, getters, mutations, actions };
