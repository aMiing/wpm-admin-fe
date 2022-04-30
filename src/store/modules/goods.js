/**
 * @author
 * @description 代码生成机状态管理
 */
import { getList } from '@/api/table';
const state = () => ({
  allGoodsList: [],
  total: 0,
  currentGoodsList: [],
});
const getters = {
  getGoodsList: state => state.allGoodsList, //所有商品列表
  getTotal: state => state.total, //商品总条数
  getFiltList: state => state.currentGoodsList,
};

const mutations = {
  //修改商品列表
  GoodsList(state, { data, total, type }) {
    state.allGoodsList = data;
    state.total = total;
  },
  addGoodsItem(state, item) {
    let index = -1;
    state.allGoodsList.forEach((e, ind) => {
      e.createTime = new Date();
      if (e.uuid === item.uuid) {
        index = ind;
      }
    });
    ~index ? (state.allGoodsList[index] = item) : state.allGoodsList.unshift(item);
  },
  resetStock(state, list) {
    list.forEach(e => {
      e.stock = e.stock - e.saled;
      let index = -1;
      state.allGoodsList.forEach((e, ind) => {
        if (e.uuid === e.uuid) {
          index = ind;
        }
      });
      ~index && (state.allGoodsList[index] = e);
    });
  },
  delGoodsList(state, uuid) {
    let index = -1;
    state.allGoodsList.forEach((e, ind) => {
      if (e.uuid === uuid) index = ind;
    });
    ~index && state.allGoodsList.splice(index, 1);
  },
  getFilterData(state, config) {
    const { title = '', pageNo = 1, pageSize = 20, filterType = [] } = config;
    let mockList = title
      ? state.allGoodsList.filter(item => {
          return ~(item.name + item.uuid).indexOf(title);
        })
      : state.allGoodsList;
    const typeStr = filterType.length
      ? filterType.reduce((count, type) => {
          return count + (type.select ? type.label + ' ' : '');
        }, '')
      : '';
    mockList = typeStr
      ? mockList.filter(e => {
          const types = e.type.split(',');
          return types.some(e => ~typeStr.indexOf(e));
        })
      : mockList;
    const pSize = pageSize * (pageNo - 1) >= mockList.length ? 1 : pageSize; //兼容处理
    const pageList = mockList.filter(
      (item, index) => index < pSize * pageNo && index >= pSize * (pageNo - 1),
    );
    state.currentGoodsList = pageList;
    state.total = mockList.length;
  },
};
const actions = {
  //获取商品列表
  async setGoodsList({ commit }, params) {
    // 请求数据
    const { data } = await getList(params);
    commit('GoodsList', data);
  },
  addGoodsItem({ commit }, list) {
    commit('addGoodsItem', list);
  },
  delGoodsList({ commit }, list) {
    list.uuid.split(',').forEach(e => {
      commit('delGoodsList', e);
    });
    // commit('getFilterData', {
    //   title: ""
    // })
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
