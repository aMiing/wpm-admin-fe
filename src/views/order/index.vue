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
            placeholder="输入商品名称搜索"
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
    <div class="checkbox-content time-select">
      <el-radio-group v-model="initSelectRadio" @change="radioSelectChange">
        <el-radio-button label="今天"></el-radio-button>
        <el-radio-button label="昨天"></el-radio-button>
        <el-radio-button label="近一周"></el-radio-button>
        <el-radio-button label="近30天"></el-radio-button>
        <el-radio-button label="近90天"></el-radio-button>
      </el-radio-group>
      <div class="initTime">
        <el-date-picker
          v-model="initStartDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="pickerDateChange"
        >
        </el-date-picker>
      </div>
    </div>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @sort-change="tableSortChange"
    >
      <el-table-column
        show-overflow-tooltip
        label="订单编号"
        prop="uuid"
        width="240"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="purchase"
        label="购买商品"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="销售员"
        prop="salesperson"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="allPayPrice"
        label="订单金额"
        sortable
        sort-by="allPayPrice"
      >
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="订单状态"
      >
        <template #default="{ row }">
          <el-tag :type="row.state | statusFilter">
            {{ (row.state) | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="订单生成时间" width="200">
        <template #default="{ row }">
          <span>{{ row.createTime | timeFilter }}</span>
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import { getList } from "@/api/order";
export default {
  name: "Order", //销售订单列表
  filters: {
    statusFilter(status) {
      return status === 1 ? "success" : "info";
    },
    statusTextFilter(status) {
      return status === 1 ? "有效" : "无效";
    },
    timeFilter(NS) {
      return new Date(NS).toLocaleString();
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
        filtType: [],
      },
      initStartDate: "",
      initSelectRadio: "今天",
    };
  },
  computed: {
    ...mapGetters({
      list: "order/getFiltList",
      total: "order/getTotal",
    }),
    height() {
      return this.$baseTableHeight();
    },
  },
  watch: {
    queryForm: {
      handler(val) {
        this.getFiltData(val);
      },
      deep: true,
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    ...mapMutations({
      getFiltData: "order/getFiltData",
      setCurrenList: "order/setCurrenList",
    }),
    ...mapActions({
      setOrderList: "order/setOrderList",
    }),
    radioSelectChange(label) {
      // 选中日期变化，更新数据
      const today = new Date().toLocaleDateString();
      const Now = new Date().getTime();
      const Zero = new Date(today).getTime();
      const oneDay = 1000 * 3600 * 24;
      let timeRange = [];
      switch (label) {
        case "今天":
          timeRange = [Zero, Now];
          break;
        case "昨天":
          timeRange = [Zero - oneDay, Zero];
          break;
        case "近一周":
          timeRange = [Now - 7 * oneDay, Now];
          break;
        case "近30天":
          timeRange = [Now - 30 * oneDay, Now];
          break;
        case "近90天":
          timeRange = [Now - 90 * oneDay, Now];
          break;
        default:
          timeRange = [Zero, Now];
          break;
      }
      this.pickerDateChange(timeRange);
    },
    async pickerDateChange(dates) {
      this.setOrderList(dates);
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
      this.radioSelectChange(this.initStartDate);
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },
  },
};
</script>
<style lang="scss">
.checkbox-content {
  &.time-select {
    display: flex;
    justify-content: flex-start;
    .initTime {
      margin: 0 12px 5px;
    }
  }
}
</style>
