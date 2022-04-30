/**
 * @author
 * @description 代码生成机状态管理
 */
import { getList, doEdit } from '@/api/vip';

const state = () => ({
  memberList: [],
  currentMemberList: [],
  total: 0,
  selected: null,
});
const getters = {
  getList: state => state.memberList,
  getFiltList: state => state.currentMemberList,
  getTotal: state => state.total,
  getSelectedVip: state => state.selected,
};

const mutations = {
  setList(state, memberList) {
    state.memberList = memberList;
  },
  addItem(state, item) {
    let index = -1;
    state.memberList.forEach((e, ind) => {
      if (e.uuid === item.uuid) {
        index = ind;
      }
    });
    ~index ? (state.memberList[index] = item) : state.memberList.unshift(item);
  },

  delItem(state, uuid) {
    let index = -1;
    state.memberList.forEach((e, ind) => {
      if (e.uuid === uuid) index = ind;
    });
    ~index && state.memberList.splice(index, 1);
  },
  getFilterData(state, config) {
    const { title = '', pageNo = 1, pageSize = 20 } = config;
    let mockList = title
      ? state.memberList.filter(item => {
          return ~(item.name + item.PN).indexOf(title);
        })
      : state.memberList;
    const pageList = mockList.filter(
      (item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1),
    );
    state.currentMemberList = pageList;
    state.total = mockList.length;
  },
  setSelectedVip(state, item) {
    state.selected = item;
  },
  resetBalance(state, item) {
    state.memberList.forEach(e => {
      e.uuid === item.uuid && ((e.balance = item.balance), (e.integral = item.integral));
    });
  },
};
const actions = {
  async setList({ commit }, config) {
    // 请求数据
    const { data } = await getList(config || []);
    commit('setList', data);
    commit('getFilterData', {});
  },
  async updateBalance({ commit }, item) {
    await doEdit(item, 'edit');
    commit('resetBalance', item);
    commit('getFilterData', {});
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
