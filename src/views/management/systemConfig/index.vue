<template>
  <div class="systemConfig">
    <div class="systemConfig-content">
      <el-row>
        <h2 class="systemConfig-content-head">系统信息管理</h2>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="system-form-content">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="90px"
            >
              <el-form-item label="系统名称" prop="sys_name">
                <el-input
                  v-model="ruleForm.sys_name"
                  placeholder="请输入系统名称（2-8个字符）"
                ></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="imageUrl">
                <el-upload
                  ref="logoUpload"
                  class="avatar-uploader"
                  action="http://localhost:3000/api/upload/uploadImg"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <!--    -->
                  <img
                    v-if="ruleForm.sys_logo"
                    :src="ruleForm.sys_logo"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >更新</el-button
                >
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
const { getAccessToken } = require("@/utils/accessToken.js");
const { uploadImg } = require("@/api/upload");
const { updateSysInfo } = require("@/api/user");
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "systemConfig",
  data() {
    return {
      ruleForm: {
        sys_name: "",
        sys_logo: "",
      },
      rules: {
        sys_name: [
          {
            required: true,
            message: "请输入系统名称或点击重置恢复默认",
            trigger: "blur",
          },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      loadFileName: "", //服务端返回的文件名
    };
  },
  computed: {
    ...mapGetters({
      systemInfo: "user/getSysInfo",
    }),
  },
  mounted() {
    this.ruleForm = Object.assign({}, this.systemInfo);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await updateSysInfo({
              sys_name: this.ruleForm.sys_name,
              sys_logo: this.loadFileName,
            });
            // 成功，跳转到登录页
            await this.$store.dispatch("user/logout");
            this.$baseMessage("保存成功！即将跳转到登录页~", "success");
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          } catch {
            // 失败
            this.$baseMessage("保存失败", "error");
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.loadFileName = file.response.filename;
      this.ruleForm.sys_logo = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isImage = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传头像必须是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImage && isLt2M;
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
</style>