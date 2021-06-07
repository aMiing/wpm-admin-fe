/**
 * @author 
 * @description 代码生成机状态管理
 */
import {
  getList
} from '@/api/table'

const state = () => ({
  allGoodsList: [],
  currentGoodsList: [],
  total: 0,
  allTypes: []
})
const getters = {
  getGoodsList: (state) => state.allGoodsList,
  getFiltList: (state) => state.currentGoodsList,
  getTotal: state => state.total,
  getAllTypes: state => state.allTypes,
}

const mutations = {
  setGoodsList(state, allGoodsList) {
    state.allGoodsList = allGoodsList
  },
  setCurrenList(state, list) {
    state.currentGoodsList = list
  },
  updateAllTypes(state) {
    let typeList = []
    state.allGoodsList.forEach(e => {
      const labelArr = String(e.type).trim().split(',')
      typeList = typeList.concat(labelArr)
    })
    state.allTypes = [...new Set(typeList)].map(e => {
      return {
        label: e,
        select: false
      }
    })
  },
  addGoodsItem(state, item) {
    let index = -1;
    state.allGoodsList.forEach((e, ind) => {
      if (e.uuid === item.uuid) {
        index = ind
      }
    });
    ~index ? state.allGoodsList[index] = item : state.allGoodsList.unshift(item)
  },
  resetStock(state, list) {
    list.forEach(e => {
      e.stock = e.stock - e.saled;
      let index = -1;
      state.allGoodsList.forEach((e, ind) => {
        if (e.uuid === e.uuid) {
          index = ind
        }
      });
      ~index && (state.allGoodsList[index] = e)
    })
  },
  delGoodsList(state, uuid) {
    let index = -1;
    state.allGoodsList.forEach((e, ind) => {
      if (e.uuid === uuid) index = ind;
    });
    ~index && state.allGoodsList.splice(index, 1)
  },
  getFiltData(state, config) {
    const {
      title = '', pageNo = 1, pageSize = 20, filtType = []
    } = config
    let mockList = title ? state.allGoodsList.filter((item) => {
      return ~(item.name + item.uuid).indexOf(title)
    }) : state.allGoodsList;
    const typeStr = filtType.length ? filtType.reduce((count, type) => {
      return count + (type.select ? (type.label + ' ') : '')
    }, '') : '';
    mockList = typeStr ? mockList.filter(e => {
      const types = e.type.split(',');
      return types.some(e => ~typeStr.indexOf(e))
    }) : mockList;
    const pSize = pageSize * (pageNo - 1) >= mockList.length ? 1 : pageSize //兼容处理
    const pageList = mockList.filter((item, index) =>
      index < pSize * pageNo && index >= pSize * (pageNo - 1)
    )
    state.currentGoodsList = pageList;
    state.total = mockList.length;
  }
}
const actions = {
  async setGoodsList({
    commit
  }) {
    // 请求数据
    const {
      data
    } = await getList()
    commit('setGoodsList', data)
    commit('updateAllTypes')
  },
  addGoodsItem({
    commit
  }, list) {
    commit('addGoodsItem', list)
    commit('getFiltData', {
      title: ""
    })
  },
  delGoodsList({
    commit
  }, list) {
    list.uuid.split(',').forEach(e => {
      commit('delGoodsList', e)
    })
    commit('getFiltData', {
      title: ""
    })
  },
}


export default {
  state,
  getters,
  mutations,
  actions
}