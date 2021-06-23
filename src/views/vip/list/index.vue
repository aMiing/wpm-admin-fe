<template>
  <div class="table-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"> 添加 </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete"> 批量删除 </el-button>
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

    <el-table ref="tableSort" :data="list" :height="height" @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip label="手机号" prop="PN" width="160"></el-table-column>
      <el-table-column show-overflow-tooltip label="昵称" prop="name" width="160">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="balance" sortable label="余额"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="积分"
        prop="integral"
        sortable
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="录入时间" min-width="160">
        <template #default="{ row }">
          <span>{{ row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="150px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
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
import { doDelete, doEdit } from '@/api/vip';
import TableEdit from './components/TableEdit';
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'vipManagement',
  components: {
    TableEdit,
  },
  filters: {
    statusFilter(status) {
      return status === 1 ? 'success' : 'info';
    },
    timeFilter(NS) {
      return new Date(NS).toLocaleString();
    },
  },
  data() {
    return {
      imgShow: true,
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
      list: 'vip/getFiltList',
      total: 'vip/getTotal',
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
  async mounted() {
    await this.$nextTick();
    const { operate } = this.$route.query;
    operate === 'add' && this.handleAdd();
  },
  methods: {
    ...mapMutations({
      addCartItem: 'vip/addItem',
      getFiltData: 'vip/getFiltData',
    }),
    ...mapActions({
      setList: 'vip/setList',
      delItems: 'vip/delItems',
    }),
    handleStatusText(state) {
      return state === 1 ? '在售' : '下架';
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
    handleDelete(row) {
      if (row.uuid) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg } = await doDelete({ uuid: row.uuid });
          await this.delItems({ uuid: row.uuid });
          this.$baseMessage(msg, 'success');
        });
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map(item => item.uuid).join(',');
          this.$baseConfirm('你确定要删除选中项吗', null, async () => {
            const { msg } = await doDelete({ uuid: ids });
            await this.delItems({ uuid: ids });
            this.$baseMessage(msg, 'success');
          });
        } else {
          this.$baseMessage('未选中任何行', 'error');
          return false;
        }
      }
    },
    clearSearchKey() {
      this.handleQuery();
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
.right-panel {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
}
</style>
