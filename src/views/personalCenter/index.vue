<template>
  <div class="personalCenter-container">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="个人简介"
        >个人简介
        <div
          style="
            width: 72px;
            height: 72px;
            border-radius: 30px;
            margin: 100px;
            box-shadow: 1px 1px 4px #f86;
            display: flex;
          "
        >
          <i class="dots-loader" style="margin: auto"></i>
        </div>
      </el-tab-pane>
      <el-tab-pane label="基本设置">基本设置</el-tab-pane>
      <el-tab-pane label="安全设置">安全设置</el-tab-pane>
      <el-tab-pane label="账户绑定">安全设置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "PersonalCenter",
  data() {
    return {
      tabPosition: "left",
    };
  },
  created() {},
  methods: {},
};
</script>
