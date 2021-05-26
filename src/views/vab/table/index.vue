<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button type="primary" @click="testMessage">baseMessage</el-button>
        <el-button type="primary" @click="testALert">baseAlert</el-button>
        <el-button type="primary" @click="testConfirm">baseConfirm</el-button>
        <el-button type="primary" @click="testNotify">baseNotify</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="输入名称或编号搜索"  clearable @clear="clearSearchKey"/>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column
        show-overflow-tooltip
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="编号" prop="uuid" width="240">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="title"
        label="名称"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="图片">
        <template #default="{ row }">
          <el-image
            v-if="imgShow"
            :preview-src-list="imageList"
            :src="row.img"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="price"
        label="单价"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="库存"
        prop="pageViews"
        sortable
        width="80"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="生产商"
        prop="author"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template #default="{ row }">
          <!-- <el-tag v-if="Number(row.pageViews) === 0" type="danger">
            售罄
          </el-tag> -->
          <el-tag :type="row.switch | statusFilter">
            {{ handleStatusText(row.switch) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="录入时间"
        prop="datetime"
        width="200"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleOffOrOn(row)">{{row.switch ? '下架':'上架'}}</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import { getList, doDelete, doOffOrOn } from '@/api/table'
  import TableEdit from './components/TableEdit'
  import{successCode} from '@/config'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        return status ? 'success': 'info'
      },
    },
    data() {
      return {
        imgShow: true,
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        allGoodsList: 'goods/getGoodsList',
        list: 'goods/getFiltList',
        total: 'goods/getTotal'
      }),
      height() {
        return this.$baseTableHeight()
      },
    },
    
    watch: {
      queryForm: {
        handler(val) {
          this.getFiltData(val)
        },
        deep: true,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapMutations({
        addCartItem: 'cart/addCartItem',
        setGoodsList: 'goods/setGoodsList',
        getFiltData: 'goods/getFiltData',
      }),
      handleStatusText(state) {
        return state ? '在售' : '下架'
      },
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      async handleOffOrOn(row) {
        const {msg, code} = await doOffOrOn(row)
        successCode.includes(code) && (row.switch = !row.switch)
        this.$baseMessage(msg, 'success')
        // 请求数据更新
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            // this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              // this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      clearSearchKey() {
        this.handleQuery()
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        // this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        // this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        // this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getList()
        this.setGoodsList(data)
        this.queryForm.pageSize = 20
        const imageList = []
        data.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      testMessage() {
        this.$baseMessage('test1', 'success')
      },
      testALert() {
        this.$baseAlert('11')
        this.$baseAlert('11', '自定义标题', () => {
          /* 可以写回调; */
        })
        this.$baseAlert('11', null, () => {
          /* 可以写回调; */
        })
      },
      testConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      testNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      },
    },
  }
</script>
