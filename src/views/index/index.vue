<template>
  <div class="table-container">
    <vab-query-form>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
          size="medium"
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="输入名称或编号搜索" clearable @clear="clearSearchKey"/>
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
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="生产商"
        prop="author"
      ></el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="所属类别"
        prop="datetime"
        :filters="[{text: '', value: ''}]"
        :filter-method="filterHandler"
        sortable
      ></el-table-column> -->
      <el-table-column label="加入购物车" width="160px">
        <template #default="{ row }">
          <el-input-number v-model="row.saled" :min="0" :max="row.stock" :step="1" step-strictly @change="addedChange(row)"></el-input-number>
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
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/table'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'ComprehensiveTable',
    
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        // list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        // total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
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
      addedChange(row) {
        this.addCartItem(row)
      },
      clearSearchKey() {
        this.handleQuery()
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
      
      handleSizeChange(val) {
        this.queryForm.pageSize = val
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
      },
      handleQuery() {
        this.queryForm.pageNo = 1
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
      // filterHandler(value, row, column) {
      //   const property = column['property'];
      //   return row[property] === value;
      // }
    },
  }
</script>
