<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent size="medium">
        <el-form-item>
          <el-input
            v-model="queryForm.title"
            placeholder="输入名称或编号搜索"
            clearable
            @clear="clearSearchKey"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </vab-query-form>
    <div class="checkbox-content type-select">
      <span>按类型筛选：</span>
      <el-checkbox
        v-for="(type, index) in queryForm.filtType"
        :key="index"
        :label="type.label"
        v-model="type.select"
        border
      ></el-checkbox>
      <el-button class="select-all" type="text" @click="selectAllTypes">反选</el-button>
    </div>

    <el-table
      ref="tableSort"
      :data="fillList"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip label="编号/条码" prop="uuid"> </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip label="图片">
        <template #default="{ row }">
          <el-image
            v-if="imgShow"
            :preview-src-list="imageList"
            :src="row.img"
          ></el-image>
        </template>
      </el-table-column> -->
      <el-table-column
        show-overflow-tooltip
        prop="price"
        label="单价"
        sortable
        sort-by="price"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="库存" sortable sort-by="stock">
        <template #default="{ row }">
          {{ row.stock + ' ' + (row.unit || '') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="生产商" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="所属类别" prop="type"></el-table-column>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Index',
  filters: {},
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
        filtType: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      // allGoodsList: "goods/getGoodsList",
      list: 'goods/getFiltList',
      total: 'goods/getTotal',
      allTypes: 'goods/getAllTypes',
      cartList: 'cart/getCartList',
    }),
    fillList() {
      return this.list.map(e => {
        return {
          ...e,
          author: e.author || '--',
        };
      });
    },
    height() {
      return this.$baseTableHeight();
    },
  },
  watch: {
    allTypes(val) {
      this.queryForm.filtType = val;
    },
    queryForm: {
      handler(val) {
        this.getFiltData(val);
        this.mergeCartList();
      },
      deep: true,
    },
  },
  async created() {
    await this.fetchData();
    this.mergeCartList();
  },
  methods: {
    ...mapMutations({
      addCartItem: 'cart/addCartItem',
      delCartItem: 'cart/delCartItem',
      getFiltData: 'goods/getFiltData',
      setCurrenList: 'goods/setCurrenList',
    }),
    ...mapActions({
      setGoodsList: 'goods/setGoodsList',
    }),

    mergeCartList() {
      const list = this.fillList.map(e => {
        const saled = this.cartList?.find(i => e.uuid === i.uuid)?.saled || 0;
        return { ...e, saled };
      });
      this.setCurrenList(list);
    },
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

    handleSizeChange(val) {
      this.queryForm.pageSize = val;
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
    },
    handleQuery() {
      this.queryForm.pageNo = 1;
    },
    async fetchData() {
      const Loading = this.$baseColorfullLoading(1);
      await this.setGoodsList();
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
      this.queryForm.filtType = this.queryForm.filtType.map(e => {
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
