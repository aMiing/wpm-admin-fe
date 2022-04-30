<template>
  <el-dialog title="折扣" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="折扣" prop="discount">
        <el-input v-model.trim="form.discount" autocomplete="off">
          <template slot="append"> % </template>
        </el-input>
        <div class="preValue">
          <div v-for="val in preValue" :key="val" class="preValue-list" @click="preValueClick(val)">
            {{ val }}
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close"> 取 消 </el-button>
      <el-button type="primary" @click="save"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DiscountEdit',
  data() {
    return {
      form: {
        discount: '',
      },
      mode: 'add',
      dialogFormVisible: false,
      preValue: [100, 95, 90, 88, 85, 80, 75, 70, 68, 65, 60, 50],
    };
  },
  computed: {
    ...mapGetters({
      discount: 'cart/getDiscount',
    }),
  },
  methods: {
    ...mapMutations({
      setDiscount: 'cart/setDiscount',
    }),
    preValueClick(val) {
      this.form.discount = val;
    },
    showEdit() {
      this.discount !== 1 && (this.form.discount = this.discount * 100);
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs['form'].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
    save() {
      this.setDiscount(this.form.discount);
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.preValue {
  padding: 12px 0;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  .preValue-list {
    border: 1px solid #b3d8ff;
    border-radius: 2px;
    height: 38px;
    line-height: 38px;
    width: 40px;
    margin: 4px;
    text-align: center;
    background: #ecf5ff;
    color: #409eff;
    cursor: pointer;
    // font-weight: bold;
    &:hover {
      font-size: 1.2em;
    }
  }
}
</style>
