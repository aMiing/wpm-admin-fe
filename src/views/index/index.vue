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
    </vab-query-form>
    <div class="type-checkbox-content">
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
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column
        show-overflow-tooltip
        label="编号"
        prop="uuid"
        width="240"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="名称"
      ></el-table-column>
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
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="库存"
        prop="stock"
        sortable
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="生产商"
        prop="author"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="所属类别"
        prop="type"
        sortable
        sort-by="type"
      ></el-table-column>
      <el-table-column label="加入购物车" width="160px">
        <template #default="{ row }">
          <el-input-number
            v-model="row.saled"
            :min="0"
            :max="row.stock"
            :step="1"
            step-strictly
            @change="addedChange(row)"
          ></el-input-number>
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
import { doDelete } from "@/api/table";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "ComprehensiveTable",

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      imgShow: true,
      imageList: [],
      listLoading: true,
      layout: "total, sizes, prev, pager, next, jumper",
      background: true,
      selectRows: "",
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
        filtType: [
          { label: "化妆品", select: true },
          { label: "电子产品", select: true },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      // allGoodsList: "goods/getGoodsList",
      list: "goods/getFiltList",
      total: "goods/getTotal",
      allTypes: "goods/getAllTypes",
      cartList: 'cart/getCartList',
    }),
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
      },
      deep: true,
    },
  },
  async created() {
    await this.fetchData();
    this.mergeCartList()
  },
  methods: {
    ...mapMutations({
      addCartItem: "cart/addCartItem",
      delCartItem: "cart/delCartItem",
      getFiltData: "goods/getFiltData",
      setCurrenList: "goods/setCurrenList",
    }),
    ...mapActions({
      setGoodsList: "goods/setGoodsList",
    }),

    mergeCartList() {
      const list = this.list.map(e => {
        const saled = this.cartList?.find(i => e.uuid === i.uuid)?.saled || 0;
        return {...e, saled}
      })
      this.setCurrenList(list)
    },
    addedChange(row) {
      Number(row.saled) > 0 ? this.addCartItem(row) : this.delCartItem(row);
    },
    clearSearchKey() {
      this.handleQuery();
    },
    tableSortChange() {
      const imageList = [];
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img);
      });
      this.imageList = imageList;
    },
    setSelectRows(val) {
      this.selectRows = val;
    },
    handleAdd() {
      this.$refs["edit"].showEdit();
    },
    handleEdit(row) {
      this.$refs["edit"].showEdit(row);
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
      this.listLoading = true;
      await this.setGoodsList();
      // this.queryForm.pageSize = 20;
      const imageList = [];
      this.list.forEach((item, index) => {
        imageList.push(item.img);
      });
      this.imageList = imageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },
    selectAllTypes() {
      this.queryForm.filtType = this.queryForm.filtType.map(e => {
        return Object.assign(e, {select: !e.select})
      })
    }
  },
};
</script>
<style lang="scss">
.type-checkbox-content {
  margin-bottom: 10px;
}
.el-checkbox {
  margin: 0 5px 5px 0;
}
.select-all{
  margin: 0 10px;
}
</style>
