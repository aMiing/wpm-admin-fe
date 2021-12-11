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

    <el-table
      ref="tableSort"
      :data="fillList"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip label="编号/条码" prop="uuid" min-width="200">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
      <el-table-column show-overflow-tooltip label="图片" width="150">
        <template #default="{ row }">
          <el-image v-if="imgShow" :preview-src-list="imageList" :src="row.img">
            <div slot="error" class="image-slot">暂无图片</div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="录入时间" min-width="150">
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
    <table-edit ref="edit" @fetchData="fetchData"></table-edit>
  </div>
</template>

<script>
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { formatTime } from '@/utils/index.js';
import { DeleteTypes, getTypeList } from '@/api/classification.js';
import TableEdit from './components/TableEdit';
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit,
  },
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
      fillList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true,
      selectRows: '',
      total: 0,
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: '',
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
  async mounted() {
    await this.$nextTick();
    const { operate } = this.$route.query;
    operate === 'add' && this.handleAdd();
  },
  methods: {
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
    handleDelete(row) {
      if (row.uuid) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg, code } = await DeleteTypes({ uuid: row.uuid });
          if (code == 200) {
            let index = this.fillList.findIndex(value => {
              return value.uuid == row.uuid;
            });
            this.fillList.splice(index, 1);
          }
          this.$baseMessage(msg, 'success');
        });
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map(item => item.uuid);
          this.$baseConfirm('你确定要删除选中项吗', null, async () => {
            const { msg, code, data } = await DeleteTypes({ uuid: ids });
            if (code == 200) {
              // this.fetchData();
              this.fillList = this.fillList.filter(value => {
                return ids.indexOf(value.uuid) == -1;
              });
            }
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
      getTypeList(this.queryForm).then(res => {
        if (res.code == 200) {
          this.fillList = res.data.data;
          this.total = res.data.total;
        }
      });
      setTimeout(() => {
        Loading.close();
      }, 500);
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
