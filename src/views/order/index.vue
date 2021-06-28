<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent size="medium">
        <el-form-item>
          <el-input
            v-model="queryForm.title"
            placeholder="输入商品名称搜索"
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
    <div class="checkbox-content time-select">
      <select-date @setDateEmit="setDateEmit" />
    </div>

    <el-table ref="tableSort" :data="list" :height="height" @sort-change="tableSortChange">
      <el-table-column show-overflow-tooltip label="订单编号" prop="uuid"> </el-table-column>
      <el-table-column show-overflow-tooltip prop="purchase" label="购买商品"></el-table-column>

      <el-table-column show-overflow-tooltip label="销售员" prop="salesperson"></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="originPayPrice"
        label="订单总价(元)"
        sort-by="originPayPrice"
      >
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="discount" label="折扣" min-width="40">
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="realPayPrice"
        label="折扣后总价(元)"
        sort-by="realPayPrice"
      >
      </el-table-column>

      <el-table-column show-overflow-tooltip label="支付方式">
        <template #default="{ row }">
          <span :class="row.payMethod">{{ row.payMethod | payMethodFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="会员PN">
        <template #default="{ row }">
          <span>{{ row.PN || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="余额支付(元)">
        <template #default="{ row }">
          <span>{{ row.balancePay || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="surplusPayment" label="当场支付(元)">
      </el-table-column>

      <!-- <el-table-column show-overflow-tooltip label="订单状态">
        <template #default="{ row }">
          <el-tag :type="row.state | statusFilter">
            {{ row.state | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column> -->

      <el-table-column show-overflow-tooltip label="订单生成时间" min-width="125">
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SelectDate from '@/components/SelectDate';
import { formatTime } from '@/utils/index.js';
export default {
  name: 'Order', //销售订单列表
  components: {
    SelectDate,
  },
  filters: {
    statusFilter(status) {
      return status === 1 ? 'success' : 'info';
    },
    statusTextFilter(status) {
      return status === 1 ? '有效' : '无效';
    },
    timeFilter(NS) {
      return formatTime(new Date(NS), '{yy}-{mm}-{dd} {hh}:{ii}:{ss}');
    },
    payMethodFilter(method) {
      const payMethodMap = {
        'balance-pay': '余额',
        'integral-pay': '积分抵扣',
      };
      return payMethodMap[method] || '立即支付';
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
        filtType: [],
      },
      initStartDate: '',
      initSelectRadio: '今天',
    };
  },
  computed: {
    ...mapGetters({
      list: 'order/getFiltList',
      total: 'order/getTotal',
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
      getFiltData: 'order/getFiltData',
      setCurrenList: 'order/setCurrenList',
    }),
    ...mapActions({
      setOrderList: 'order/setOrderList',
    }),
    async setDateEmit(dates) {
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
      this.$refs.tableSort.tableData.forEach(item => {
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
      const Loading = this.$baseColorfullLoading(1);
      setTimeout(() => {
        Loading.close();
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.balance-pay {
  color: #67c23a;
}
.integral-pay {
  color: #f56c6c;
}
</style>

