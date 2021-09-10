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
              <el-input v-model="queryForm.title" placeholder="输入名称或编号搜索" clearable @clear="clearSearchKey" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery"> 查询 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="checkbox-content type-select">
      <span>按类型筛选：</span>
      <el-select v-model="queryForm.value" placeholder="请选择">
        <el-option v-for="(type, index) in filtType" :key="index" :label="type.name" :value="type.uuid"> </el-option>
      </el-select>
    </div>

    <el-table ref="tableSort" :data="fillList" :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange">
      <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
      <el-table-column show-overflow-tooltip label="编号/条码" prop="uuid" min-width="200"> </el-table-column>
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

      <el-table-column show-overflow-tooltip prop="price" label="单价" sortable sort-by="price"></el-table-column>
      <el-table-column show-overflow-tooltip label="库存" sortable sort-by="stock" min-width="80">
        <template #default="{ row }">
          {{ row.stock + " " + (row.unit || "") }}
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="生产商" prop="author"></el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template #default="{ row }">
          <!-- <el-tag v-if="Number(row.stock) === 0" type="danger">
            售罄
          </el-tag> -->
          <el-tag :type="row.online | statusFilter">
            {{ handleStatusText(row.online) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="所属类别" prop="type" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip label="录入时间" min-width="150">
        <template #default="{ row }">
          <span>{{ row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="150px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleOffOrOn(row)">{{ row.online === 1 ? "下架" : "上架" }}</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout" :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
    <table-edit ref="edit" @fetchData="fetchData"></table-edit>
  </div>
</template>

<script>
import { doDelete, doEdit,getList } from "@/api/table";
import TableEdit from "./components/TableEdit";
import { successCode } from "@/config";
import { formatTime } from "@/utils/index.js";
import { getTypeList } from "@/api/classification";
export default {
  name: "ComprehensiveTable",
  components: {
    TableEdit,
  },
  filters: {
    statusFilter(status) {
      return status === 1 ? "success" : "info";
    },
    timeFilter(NS) {
      return NS ? formatTime(new Date(NS), "{yy}-{mm}-{dd} {hh}:{ii}:{ss}") : "--";
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
      fillList: [],
      total: 0,
      filtType: [],
      queryForm: {
        pageNo: 1,
        pageSize: 20,
        title: "",
        value: "", //类型选中的值
      },
    };
  },
  computed: {
    height() {
      return this.$baseTableHeight();
    },
  },

  watch: {},
  async mounted() {
    await this.$nextTick();
    await this.fetchData();
    const { operate } = this.$route.query;
    operate === "add" && this.handleAdd();
  },
  methods: {
    handleStatusText(state) {
      return state === 1 ? "在售" : "下架";
    },
    tableSortChange() {
      const imageList = [];
      this.$refs.tableSort.tableData.forEach((item) => {
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
    async handleOffOrOn(row) {
      row.online = row.online === 1 ? 2 : 1;
      const { msg, code } = await doEdit(row, "edit");
      !successCode.includes(code) && (row.online = row.online === 1 ? 2 : 1);
      this.$baseMessage(msg, "success");
      // 请求数据更新
      this.fetchData();
    },
    handleDelete(row) {
      if (row.uuid) {
        this.$baseConfirm("你确定要删除当前项吗", null, async () => {
          const { msg, code } = await doDelete({ uuid: row.uuid });
          if (code == 200) {
            let index = this.fillList.findIndex((value) => {
              return value.uuid == row.uuid;
            });
            this.fillList.splice(index, 1);
          }
          this.$baseMessage(msg, "success");
        });
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map((item) => item.uuid);
          this.$baseConfirm("你确定要删除选中项吗", null, async () => {
            const { msg, code, data } = await doDelete({ uuid: ids });
            if (code == 200) {
              this.fillList = this.fillList.filter((value) => {
                return ids.indexOf(value.uuid) == -1;
              });
            }
            this.$baseMessage(msg, "success");
          });
        } else {
          this.$baseMessage("未选中任何行", "error");
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
      //获取商品列表数据
      await getList(this.queryForm).then((res) => {
        this.fillList = res.data.data;
        this.total = res.data.total;
      });
      await getTypeList().then((res) => {
        this.filtType = res.data.data;
      });
      // const imageList = [];
      // this.fillList.forEach((item) => {
      //   imageList.push(item.img);
      // });
      // this.imageList = imageList;
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
