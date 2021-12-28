<template>
  <div class="create">
    <div class="create-content">
      <el-row :gutter="30">
        <el-col :span="8" :offset="4">
          <div class="grid-content single" @click="handleCreateType('manual')">手动输入</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content qrcode" @click="handleCreateType('qrcode')">条码搜索</div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8" :offset="4">
          <div class="grid-content batch" @click="handleCreateType('batch')">批量导入(excel)</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content more">更多方式...</div>
        </el-col>
      </el-row>
    </div>
    <table-edit ref="edit"></table-edit>
  </div>
</template>
<script>
import tableEdit from './components/TableEdit';
export default {
  name: 'createGoods',
  components: {
    tableEdit,
  },
  data() {
    return {};
  },
  methods: {
    handleCreateType(type) {
      if (type === 'manual') {
        this.$router.push({ path: '/goods/stock', query: { operate: 'add' } });
      } else {
        this.$refs.edit.showEdit(type);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.create {
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .create-content {
    width: 100%;
    .grid-content {
      height: 160px;
      line-height: 160px;
      box-shadow: 0 0 1px red;
      margin: 15px 0;
      text-align: center;
      color: #fff;
      font-size: 26px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 2px;
      &:hover {
        font-size: 30px;
      }

      &.single {
        background-color: #409eff;
        &:hover {
          box-shadow: 0 0 4px #409eff;
        }
      }
      &.batch {
        background-color: #e6a23c;

        &:hover {
          box-shadow: 0 0 4px #e6a23c;
        }
      }
      &.qrcode {
        background-color: #67c23a;
        &:hover {
          box-shadow: 0 0 4px #67c23a;
        }
      }
      &.more {
        background-color: #909399;
        &:hover {
          box-shadow: 0 0 4px #909399;
        }
      }
    }
  }
}
</style>