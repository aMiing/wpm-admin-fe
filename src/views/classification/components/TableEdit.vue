<template>
  <el-dialog :title="mode == 'edit' ? '编辑' : '添加'" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEditType } from "@/api/classification";
import { successCode } from "@/config";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "TableEdit",
  data() {
    return {
      form: {
        name: "",
      },
      rules: {
        name: [{ required: true, trigger: "blur", message: "请输入名称" }],
      },
      mode: "",
      dialogFormVisible: false,
    };
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.mode = "add";
      } else {
        this.mode = "edit";
        this.form = row;
      }
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
      this.$refs["form"].resetFields();
      this.form = this.$options.data().form;
    },
    //确认修改、新增，根据mode进行判断
    save() {
      let that = this;
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const { msg, code, data } = await doEditType(this.form, this.mode);
          if (code == 200) {
            this.$baseMessage(msg, "success");
            this.dialogFormVisible = false;
            this.$refs["form"].resetFields();
            this.form = this.$options.data().form;
            this.$emit('fetchData');
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
