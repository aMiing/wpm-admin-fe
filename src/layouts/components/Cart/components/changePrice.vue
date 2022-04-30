<template>
  <el-dialog title="改价" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="改价" prop="changedPrice">
        <el-input v-model.trim="form.changedPrice" autocomplete="off" />
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
  name: 'ChangePrice',
  data() {
    return {
      form: {
        changedPrice: '',
      },
      mode: 'add',
      dialogFormVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      changedPrice: 'cart/getChangedPrice',
    }),
  },
  methods: {
    ...mapMutations({
      setChangedPrice: 'cart/setChangedPrice',
    }),
    showEdit() {
      this.form.changedPrice = this.changedPrice;
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs['form'].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
    save() {
      this.setChangedPrice(this.form.changedPrice);
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
