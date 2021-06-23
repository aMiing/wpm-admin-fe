<template>
  <div class="vab-ad" v-if="!isNewChrome">
    <el-carousel
      height="30px"
      direction="vertical"
      :autoplay="true"
      :interval="3000"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, index) in adList" :key="index">
        <el-tag type="warning">Tips:</el-tag>
        <a target="_blank" :href="item.url">{{ item.title }}</a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
// import { getList } from '@/api/ad'
export default {
  name: "VabAd",
  data() {
    return {
      adList: [],
      isNewChrome: true,
    };
  },
  created() {
    this.fetchData();
    this.getAgentInfo();
  },
  methods: {
    async fetchData() {
      // const { data } = await getList()
      this.adList = [
        {
          title: "推荐使用新版chrome浏览器访问系统获取最佳体验！点击此处下载~",
          url: "https://chrome.en.softonic.com/",
        },
      ];
    },
    getAgentInfo() {
      var ua = navigator.userAgent.toLowerCase();
      const chromeInfo = ua.split(" ").find((e) => e.startsWith("chrome"));
      if (chromeInfo) {
        const bigVersion = Number(chromeInfo.split("/")[1].split(".")[0]);
        this.isNewChrome = bigVersion > 60;
      } else {
        this.isNewChrome = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.vab-ad {
  height: 30px;
  padding-right: $base-padding;
  padding-left: $base-padding;
  margin-bottom: -20px;
  line-height: 30px;
  cursor: pointer;

  a {
    color: #999;
  }
}
</style>
