<template>
  <el-dialog
    :title="mode == 'edit' ? '修改会员信息' : '添加会员'"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="手机号" prop="PN">
        <el-input v-model.number="form.PN" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="充值余额" prop="balance">
        <el-input
          v-model.trim="form.balance"
          autocomplete="off"
          @blur="InputNumber('balance')"
        ></el-input>
      </el-form-item>
      <el-form-item label="剩余积分" prop="integral">
        <el-input v-model.number="form.integral" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/vip';
import { successCode } from '@/config';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { checkphone } from '@/utils/regExp.js';

export default {
  name: 'TableEdit',
  data() {
    return {
      form: {
        PN: '',
        name: '',
        balance: 0,
        integral: 0,
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        PN: [{ type: 'phone', validator: checkphone, trigger: 'blur' }],
        balance: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        integral: [{ type: 'number', message: '积分必须为数字' }],
      },
      mode: '',
      dialogFormVisible: false,
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapMutations({ addVipList: 'vip/addItem', getFiltData: 'vip/getFiltData' }),
    ...mapActions({}),
    showEdit(row) {
      if (!row) {
        this.mode = 'add';
      } else {
        this.mode = 'edit';
        this.form = Object.assign({}, row);
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.$refs['form'].resetFields();
      this.form = this.$options.data().form;
      this.dialogFormVisible = false;
    },
    save() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { msg, code, data } = await doEdit(this.form, this.mode);
          if (successCode.includes(code)) {
            data.forEach(async e => {
              await this.addVipList(e);
            });
          }
          this.$baseMessage(msg, 'success');
          this.getFiltData({});
          this.dialogFormVisible = false;
          this.$refs['form'].resetFields();
          this.form = this.$options.data().form;
        } else {
          return false;
        }
      });
    },
    InputNumber(property) {
      this.form[property] = this.limitInputPointNumber(this.form[property]);
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      if (val === 0 || val === '0' || val === '') {
        return '';
      } else {
        let value = String(val).replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
        return Number(value);
      }
    },
  },
};
</script>
