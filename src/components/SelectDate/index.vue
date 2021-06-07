<template>
  <div class="select-date-content">
    <el-radio-group v-model="initSelectRadio" @change="radioSelectChange">
      <el-radio-button label="今天"></el-radio-button>
      <el-radio-button label="昨天"></el-radio-button>
      <el-radio-button label="近一周"></el-radio-button>
      <el-radio-button label="近30天"></el-radio-button>
      <el-radio-button label="近90天"></el-radio-button>
    </el-radio-group>
    <div class="initTime">
      <el-date-picker
        v-model="initStartDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        @change="pickerDateChange"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetDate",
  data() {
      return {
      initStartDate: "",
      initSelectRadio: "今天",
      }
  },
  mounted() {
      this.radioSelectChange(this.initSelectRadio)
  },
  methods: {
    radioSelectChange(label) {
      // 选中日期变化，更新数据
      const today = new Date().toLocaleDateString();
      const Now = new Date().getTime();
      const Zero = new Date(today).getTime();
      const oneDay = 1000 * 3600 * 24;
      let timeRange = [];
      switch (label) {
        case "今天":
          timeRange = [Zero, Now];
          break;
        case "昨天":
          timeRange = [Zero - oneDay, Zero];
          break;
        case "近一周":
          timeRange = [Now - 7 * oneDay, Now];
          break;
        case "近30天":
          timeRange = [Now - 30 * oneDay, Now];
          break;
        case "近90天":
          timeRange = [Now - 90 * oneDay, Now];
          break;
        default:
          timeRange = [Zero, Now];
          break;
      }
      this.pickerDateChange(timeRange);
    },
    async pickerDateChange(dates) {
      this.$emit('setDateEmit', dates)
    },
  },
};
</script>

<style lang="scss">
.select-date-content {
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-start;
    .initTime {
      margin: 0 12px 6px;
    }
}
</style>