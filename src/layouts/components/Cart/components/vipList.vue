<template>
  <el-dialog title="会员列表" :visible.sync="dialogFormVisible" width="640px" @close="close">
    <div class="vip-list-content">
      <el-table
        ref="tableSort"
        :data="list"
        highlight-current-row
        @current-change="selectRowChange"
      >
        <el-table-column show-overflow-tooltip label="手机号" prop="PN"></el-table-column>
        <el-table-column show-overflow-tooltip label="昵称" prop="name"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="balance"
          label="余额"
          sortable
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="积分"
          prop="integral"
          sortable
        ></el-table-column>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSelect">取消选中</el-button>
      <el-button @click="submitThis" :disabled="currentRow === null">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'vipList',
  data() {
    return {
      dialogFormVisible: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true,
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
        filtType: [],
      },
      currentRow: null,
    };
  },
  computed: {
    ...mapGetters({
      list: 'vip/getFiltList',
      total: 'vip/getTotal',
    }),
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    ...mapMutations({
      setSelectedVip: 'vip/setSelectedVip',
    }),
    ...mapActions({
      setList: 'vip/setList',
    }),
    showEdit() {
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
    },
    cancelSelect() {
      this.$refs.tableSort.setCurrentRow();
      this.submitThis();
    },
    submitThis() {
      this.setSelectedVip(this.currentRow);
      this.close();
    },
    selectRowChange(val) {
      this.currentRow = val;
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
      await this.setList();
      setTimeout(() => {
        Loading.close();
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-table {
    cursor: pointer;
  }
  .el-table__body tr.current-row > td {
    background-color: #41b584;
    .cell {
      color: #ffffff;
    }
  }
}
</style>
