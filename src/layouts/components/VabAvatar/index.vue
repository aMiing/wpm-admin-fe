<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <img class="user-avatar" :src="avatar" alt="" />
      <div class="user-name">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item command="personalCenter">个人中心</el-dropdown-item> -->
      <el-dropdown-item command="logout">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { recordRoute } from "@/config";

export default {
  name: "VabAvatar",
  computed: {
    ...mapGetters({
      avatar: "user/avatar",
      username: "user/username",
      systemInfo: "user/getSysInfo",
    }),
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "personalCenter":
          this.personalCenter();
          break;
      }
    },
    personalCenter() {
      this.$router.push("/personalCenter");
    },
    logout() {
      this.$baseConfirm(
        "您确定要退出" + (this.systemInfo.sys_name || this.$baseTitle) + "吗?",
        null,
        async () => {
          await this.$store.dispatch("user/logout");
          if (recordRoute) {
            const fullPath = this.$route.fullPath;
            this.$router.push(`/login?redirect=${fullPath}`);
          } else {
            this.$router.push("/login");
          }
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
