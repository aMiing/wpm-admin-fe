<template>
  <el-dialog
    :title="mode == 'edit' ? '编辑' : '添加'"
    :visible.sync="dialogFormVisible"
    width="600px"
    destroy-on-close
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="条码信息" prop="qrcode">
        <el-input
          v-model.trim="form.qrcode"
          autocomplete="off"
          placeholder="扫描商品条码将自动填充"
          autofocus="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" placeholder="输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-radio-group v-model="priceType" @change="form.price = ''">
          <el-radio-button label="single">统一价</el-radio-button>
          <el-radio-button label="multiple">阶梯价</el-radio-button>
        </el-radio-group>
        <div class="single-box price-form-content" v-if="priceType === 'single'">
          <el-input
            v-model.trim="form.price"
            autocomplete="off"
            placeholder="输入单价金额"
          ></el-input>
        </div>
        <div class="multiple-box price-form-content" v-else>
          <multiple-price-form ref="multipleForm" :priceRange="priceRange"></multiple-price-form>
        </div>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input
          v-model.trim.number="form.stock"
          autocomplete="off"
          placeholder="输入当前库存"
        ></el-input>
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
            :label="item.name"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计量方式" prop="measureType">
        <el-radio-group v-model="form.measureType">
          <el-radio-button label="count">数量</el-radio-button>
          <el-radio-button label="weight">称重</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <span v-show="showMore">
        <el-form-item label="计量单位" prop="unit">
          <el-input
            v-model.trim="form.unit"
            autocomplete="on"
            placeholder="输入商品计量单位，例如个/盒/盘等"
          ></el-input>
        </el-form-item>
        <el-form-item label="生产商" prop="author">
          <el-input
            v-model.trim="form.author"
            autocomplete="off"
            placeholder="商品生产商，非必填"
          ></el-input>
        </el-form-item>
      </span>
    </el-form>
    <el-divider content-position="right"
      ><a @click="showMore = !showMore">{{ showMore ? '收起' : '更多' }}</a></el-divider
    >
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table';
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import multiplePriceForm from './multiplePriceForm';

export default {
  name: 'TableEdit',
  components: {
    multiplePriceForm,
  },
  data() {
    return {
      form: {
        qrcode: '',
        name: '',
        author: '',
        price: '',
        stock: '',
        type: [],
        uuid: '',
        unit: '个',
        measureType: 'count',
      },
      priceType: 'single',
      priceRange: [],
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
  computed: {
    ...mapGetters({
      allTypes: 'classification/getAllTypes',
    }),
  },
  methods: {
    ...mapMutations({
      // updateAllTypes: 'goods/updateAllTypes',
    }),
    ...mapActions({
      addGoodsItem: 'goods/addGoodsItem',
      setGoodsList: 'goods/setGoodsList',
    }),
    showEdit(row) {
      if (!row) {
        this.mode = 'add';
      } else {
        this.mode = 'edit';
        this.form = row;
        if(row.priceRange) {
          this.priceType = 'multiple';
          this.priceRange = JSON.parse(row.priceRange)
        }
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.showMore = false;
      this.$refs['form'].resetFields();
      this.form = this.$options.data().form;
    },
    commit() {
      const multiplePrice = this.$refs.multipleForm.validateData();
      if (this.priceType === 'multiple' && multiplePrice) {
        this.form.price = multiplePrice.slice(-1)[0].price;
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const parames = Object.assign(this.form, {
            type: this.form.type.join(','),
            priceRange: JSON.stringify(multiplePrice || [0, this.form.price])
          });

          const { msg, code, data } = await doEdit(parames, this.mode);
          if (successCode.includes(code)) {
            this.$emit('fetchData');
          }
          this.$baseMessage(msg, 'success');
          this.dialogFormVisible = false;
          this.$refs['form'].resetFields();
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.price-form-content {
  margin-top: 4px;
}
</style>
