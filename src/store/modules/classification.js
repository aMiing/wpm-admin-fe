/**
 * @author
 * @description 代码生成机状态管理
 */
import { getTypeList } from '@/api/classification';
const state = () => ({
  typeTotal: 0,
  allTypes: [],
});
const getters = {
  getAllTypes: state => state.allTypes, //商品分类
  gettypeTotal: state => state.typeTotal, //分类总条数
};

const mutations = {
  //修改分类列表
  AllTypes(state, typeList) {
    state.allTypes = typeList.data;
    state.typeTotal = typeList.total;
  },
};
const actions = {
  //获取分类列表
  async setTypeList({ commit }, list) {
    const { data } = await getTypeList(list);
    commit('AllTypes', data);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
