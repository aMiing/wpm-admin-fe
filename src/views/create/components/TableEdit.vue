<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <div class="main">
      <div class="pre_page" v-if="!tableData.length">
        <div class="example">
          <span>1、先下载模板文件</span>
          <a :href="excelUrl">批量导入商品模板.xlsx</a>
        </div>
        <span>2、按照模板格式编辑文件</span>
        <div class="upload">
          <span>3、上传文件</span>
          <el-upload
            class="drag-upload"
            ref="upload"
            drag
            action=""
            accept=".xls,.xlsx"
            :on-progress="processFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过1M</div>
          </el-upload>
        </div>
      </div>
      <div class="table_content" v-else>
        <span>数据预览：</span>
        <el-table :data="tableData">
          <el-table-column
            v-for="head in tableHead"
            :key="head.prop"
            :prop="head.prop"
            :label="head.label"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 条码搜索 -->
    <!-- <div class="main" v-else>
      <span>输入名称: </span> 
      <el-input clearable placeholder="请输入/扫描条码或输入名称检索" v-model="qrInput"></el-input>
    </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table';
import { successCode, excelUrl } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';

import XLSX from 'xlsx';
export default {
  name: 'TableEdit',
  data() {
    return {
      title: '标题',
      type: '',
      dialogFormVisible: false,
      excelUrl: excelUrl + 'example.xlsx',
      tableData: [],
      tableHead: [
        {
          prop: 'name',
          label: '名称',
        },
        {
          prop: 'price',
          label: '单价',
        },
        {
          prop: 'author',
          label: '生产商',
        },
        {
          prop: 'stock',
          label: '库存',
        },
        {
          prop: 'type',
          label: '类别',
        },
      ],
      qrInput: '',
    };
  },
  methods: {
    showEdit(type) {
      if (type === 'batch') {
        this.type = type;
        this.title = '批量添加';
      } else {
        this.title = '条码搜索';
        this.$baseMessage('敬请期待~', 'info');
        return;
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.tableData = [];
    },
    processFile(responent, file) {
      const reader = new FileReader();
      reader.onload = e => {
        /* 解析数据 */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* 获取文件的第一个工作表（WorkSheet） */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* 数组转换 */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        /* 进行表格数据更新 */
        const _data = data.slice(1).map(row => {
          const obj = {};
          row.forEach((e, i) => {
            obj[this.tableHead[i].prop] = e || '';
          });
          return obj;
        });
        this.tableData = _data;
      };
      reader.readAsBinaryString(file.raw);
    },
    async save() {
      const { msg, code, data } = await doEdit(this.tableData, 'create');
      this.$baseMessage(msg, 'success');
      // 提交数据
      this.close();
    },
  },
};
</script>
