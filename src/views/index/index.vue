<template>
  <div class="table-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"> 新建 </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete"> 删除 </el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <div class="right-panel">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-input
                v-model="queryForm.title"
                placeholder="输入名称或编号搜索"
                clearable
                @clear="clearSearchKey"
              />
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
        </div>
      </el-col>
    </el-row>
    <div class="checkbox-content type-select">
      <span>按类型筛选：</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="(type, index) in queryForm.filterType" :key="index" :label="type.label" />
      </el-select>
    </div>

    <el-table
      ref="tableSort"
      :data="fillList"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip label="编号/条码" prop="qrcode" />
      <el-table-column show-overflow-tooltip prop="name" label="名称" />
      <!-- <el-table-column show-overflow-tooltip label="图片">
        <template #default="{ row }">
          <el-image
            v-if="imgShow"
            :preview-src-list="imageList"
            :src="row.img"
          ></el-image>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip prop="price" label="单价" sortable sort-by="price" />
      <el-table-column show-overflow-tooltip label="库存" sortable sort-by="stock">
        <template #default="{ row }">
          {{ row.stock + ' ' + (row.unit || '') }}
        </template>
      </el-table-column>
      <!-- <el-table-column show-overflow-tooltip label="状态">
        <template #default="{ row }">
          <el-tag :type="row.online | statusFilter">
            {{ handleStatusText(row.online) }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip label="生产商" prop="author" />
      <el-table-column show-overflow-tooltip label="所属类别" prop="type" />
      <el-table-column show-overflow-tooltip label="操作" min-width="150px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="text" @click="handleOffOrOn(row)">
            {{ row.online === 1 ? '下架' : '上架' }}
          </el-button>
          <el-button type="text" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="queryForm.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <table-edit ref="edit"></table-edit> -->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { getList } from '@/api/table';
// import TableEdit from "./components/TableEdit";
import { formatTime } from '@/utils/index.js';
export default {
  name: 'Index',
  // components: {
  //   TableEdit,
  // },
  filters: {
    statusFilter(status) {
      return status === 1 ? 'success' : 'info';
    },
    timeFilter(NS) {
      return NS ? formatTime(new Date(NS), '{yy}-{mm}-{dd} {hh}:{ii}:{ss}') : '--';
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
      fillList: [],
      value: '',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        total: 100,
        title: '',
        filterType: [],
      },
    };
  },
  computed: {
    height() {
      return this.$baseTableHeight();
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    addedChange(row) {
      Number(row.saled) > 0 ? this.addCartItem(row) : this.delCartItem(row);
    },
    clearSearchKey() {
      this.handleQuery();
    },
    tableSortChange() {
      const imageList = [];
      this.$refs.tableSort.tableData.forEach(item => {
        imageList.push(item.img);
      });
      this.imageList = imageList;
    },
    setSelectRows(val) {
      this.selectRows = val;
    },
    handleAdd() {
      this.$refs['edit'].showEdit();
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(row);
    },
    handleStatusText(state) {
      return state === 1 ? '在售' : '下架';
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
      this.fetchData();
    },
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.fetchData();
    },
    async fetchData() {
      const Loading = this.$baseColorfullLoading(1);
      //获取商品列表数据
      await getList({ pageSize: this.queryForm.pageSize, pageNo: this.queryForm.pageNo }).then(
        res => {
          this.fillList = res.data.data;
          this.queryForm.total = res.data.total;
        },
      );
      const imageList = [];
      this.fillList.forEach(item => {
        imageList.push(item.img);
      });
      this.imageList = imageList;
      setTimeout(() => {
        Loading.close();
      }, 500);
    },
    selectAllTypes() {
      this.queryForm.filterType = this.queryForm.filterType.map(e => {
        return Object.assign(e, { select: !e.select });
      });
    },
  },
};
</script>
<style lang="scss">
.checkbox-content {
  margin-bottom: 10px;
}
.el-checkbox {
  margin: 0 5px 5px 0;
}
.select-all {
  margin: 0 10px;
}
</style>
