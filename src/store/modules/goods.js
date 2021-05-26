/**
 * @author 
 * @description 代码生成机状态管理
 */

const state = () => ({
  allGoodsList: [],
  currentGoodsList: [],
  total: 0,
})
const getters = {
  getGoodsList: (state) => state.allGoodsList,
  getFiltList: (state) => state.currentGoodsList,
  getTotal: state => state.total,
}

const mutations = {
  setGoodsList(state, allGoodsList) {
    state.allGoodsList = allGoodsList
  },
  addGoodsItem(state, item) {
    const index = state.allGoodsList.indexOf(item)
    ~index ? state.allGoodsList[index] = item : state.allGoodsList.push(item)
  },
  resetStock(state, list) {
    list.forEach(e => {
      e.pageViews = e.pageViews - e.saled;
      const index = state.allGoodsList.indexOf(e)
      ~index && (state.allGoodsList[index] = e )
    })
  },
  delGoodsList(state, list) {
    const index = state.allGoodsList.indexOf(list)
    ~index && state.allGoodsList.splice(index, 1)
  },
  getFiltData(state, config) {
    const { title = '', pageNo = 1, pageSize = 20 } = config
    let mockList = title ? state.allGoodsList.filter((item) => {
      return ~(item.title+item.uuid).indexOf(title)
    }) : state.allGoodsList;
    const pageList = mockList.filter((item, index) =>
        index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
    )
    state.currentGoodsList = pageList;
    state.total = mockList.length;

    // return {
    //   totalCount: mockList.length,
    //   data: pageList,
    // }
  }
}
const actions = {
  setGoodsList({ commit }, goodsList) {
    commit('setGoodsList', goodsList)
  },
}
export default { state, getters, mutations, actions }
