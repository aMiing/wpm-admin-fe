/**
 * @author
 * @description 会员特权
 */
import { getPrivilege } from '@/api/privilege';

const state = () => ({
  privilege: {},
});
const getters = {
  getPrivilege: state => state.privilege,
};

const mutations = {
  setPrivilege(state, privilege) {
    state.privilege = privilege;
  },
};
const actions = {
  async getPrivilege({ commit }) {
    // 请求数据
    const { data } = await getPrivilege();
    commit('setPrivilege', data[0]);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
