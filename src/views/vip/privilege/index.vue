<template>
  <div class="systemConfig">
    <div class="systemConfig-content">
      <el-row>
        <h2 class="systemConfig-content-head">会员活动管理</h2>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="system-form-content">
            <el-form ref="form" :model="form" label-width="90px">
              <el-form-item label="会员折扣" prop="discount">
                <el-input v-model.trim="form.discount" autocomplete="off">
                  <template slot="append"> % </template>
                </el-input>
                <div class="preValue">
                  <div
                    v-for="val in preValue"
                    :key="val"
                    class="preValue-list"
                    @click="preValueClick(val)"
                  >
                    {{ val }}
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="积分规则">
                <div class="integral-input">
                  <span>每消费</span>
                  <div class="input">
                    <el-input v-model.number="form.cost_unit" />
                  </div>
                  <span>元积</span>
                  <div class="input">
                    <el-input v-model.number="form.integrals" />
                  </div>
                  <span>分</span>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button @click="resetForm('form')"> 重置 </el-button>
                <el-button type="primary" @click="submitForm('form')"> 确定 </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
const { updatePrivilege } = require('@/api/privilege');
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Privilege',
  data() {
    return {
      form: {
        discount: 100,
        integrals: 0,
        cost_unit: 1,
      },
      preValue: [100, 95, 90, 88, 85, 80, 75, 70, 68, 65, 60, 50],
    };
  },
  computed: {
    ...mapGetters({
      privilege: 'privilege/getPrivilege',
    }),
  },
  async mounted() {
    await this.getPrivilege();
    this.privilege && Object.keys(this.privilege).length && (this.form = this.privilege);
  },
  methods: {
    ...mapMutations({
      setPrivilege: 'privilege/setPrivilege',
    }),
    ...mapActions({
      getPrivilege: 'privilege/getPrivilege',
    }),

    preValueClick(val) {
      this.form.discount = val;
    },
    async submitForm(formName) {
      try {
        await updatePrivilege(this.form);
        this.setPrivilege(this.form);
        this.$baseMessage('保存成功！', 'success');
      } catch (err) {
        // 失败
        this.$baseMessage('保存失败', 'error');
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss">
.systemConfig-content {
  padding: 12px 24px;
  .system-form-content {
    margin: 12px 0;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}
.avatar {
  width: 140px;
  height: 140px;
  display: block;
}
.theme-color-preview {
  margin: 0 16px;
}

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
.integral-input {
  display: flex;
  justify-content: flex-start;
  .input {
    width: 60px;
    margin: 0 5px;
  }
}
</style>
