<template>
  <div class="systemConfig">
    <div class="systemConfig-content">
      <el-row>
        <h2 class="systemConfig-content-head">系统信息管理</h2>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="system-form-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
              <el-form-item label="系统名称" prop="sys_name">
                <el-input v-model="ruleForm.sys_name" placeholder="请输入系统名称（2-12个字符）"></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="imageUrl">
                <el-upload ref="logoUpload" class="avatar-uploader" action="/api/upload/uploadImg" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="ruleForm.sys_logo" :src="ruleForm.sys_logo" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="主题">
                <el-radio-group v-model="ruleForm.theme_name">
                  <el-radio-button label="default">默认</el-radio-button>
                  <el-radio-button label="green">绿荫草场</el-radio-button>
                  <el-radio-button label="glory">荣耀典藏</el-radio-button>
                </el-radio-group>
                <el-button class="theme-color-preview" type="text" @click="previewTheme">预览</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
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
        theme_name: "",
      },
      rules: {
        sys_name: [
          {
            required: true,
            message: "请输入系统名称或点击重置恢复默认",
            trigger: "blur",
          },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" },
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
    ...mapMutations({
      setSysInfo: "user/setSysInfo",
    }),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const params = {
              sys_name: this.ruleForm.sys_name,
              sys_logo: this.loadFileName || this.ruleForm.sys_logo,
              theme_name: this.ruleForm.theme_name,
            };
            await updateSysInfo(params);
            this.$baseMessage("保存成功！", "success");
            this.setSysInfo(params);
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
      this.ruleForm = Object.assign({}, this.systemInfo);
    },
    handleAvatarSuccess(res, file) {
      this.loadFileName = file.response.filename;
      this.ruleForm.sys_logo = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传头像必须是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImage && isLt2M;
    },
    previewTheme() {
      document.getElementsByTagName("body")[0].className = `vue-admin-theme-${this.ruleForm.theme_name}`;
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
</style>
