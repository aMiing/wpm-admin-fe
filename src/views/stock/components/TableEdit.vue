<template>
  <el-dialog
    :title="mode == 'edit' ? '编辑' : '添加'"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model.trim="form.price" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model.trim.number="form.stock" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select
          v-model="form.type"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入类别"
        >
          <el-option
            v-for="(item, index) in allTypes"
            :key="index"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <span v-show="showMore">
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model.trim="form.unit" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="生产商" prop="author">
          <el-input v-model.trim="form.author" autocomplete="off"></el-input>
        </el-form-item>
      </span>
    </el-form>
    <el-divider content-position="right"
      ><a @click="showMore = !showMore">{{ showMore ? '收起' : '更多' }}</a></el-divider
    >
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table';
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'TableEdit',
  data() {
    return {
      form: {
        name: '',
        author: '',
        price: '',
        stock: '',
        type: [],
        uuid: '',
        unit: '',
      },
      allTypes:[],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        price: [{ required: true, trigger: 'blur', message: '请输入单价' }],
        stock: [{ required: true, trigger: 'blur', message: '请输入库存' }],
      },
      mode: '',
      dialogFormVisible: false,
      showMore: false,
    };
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.mode = 'add';
      } else {
        this.mode = 'edit';
        this.form = row;
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.showMore = false;
      this.$refs['form'].resetFields();
      this.form = this.$options.data().form;
    },
    save() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const parames = Object.assign(this.form, {
            type: this.form.type.join(','),
          });
          const { msg, code, data } = await doEdit(parames, this.mode);
          if (code == 200) {
            this.$emit('fetchData')
            // data.forEach(async e => {
            //   await this.addGoodsItem(e);
            // });
          }
          this.$baseMessage(msg, 'success');
          this.dialogFormVisible = false;
          this.$refs['form'].resetFields();
          this.form = this.$options.data().form;
        } else {
          return false;
        }
      });
    },
  },
};
</script>
