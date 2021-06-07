<template>
  <div class="index-container">
    <el-row>
      <div class="title-content">
        <span class="title">数据概览</span>
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="6"
        :xl="6"
        v-for="card in salesData"
        :key="card.label"
      >
        <el-card shadow="never">
          <div slot="header">
            <div class="card-header-content">
              <span>{{ card.label }}</span>
              <span class="order-count">
                <strong>
                  <i>{{ card.orderCount }}</i>
                </strong>
                单
              </span>
            </div>
          </div>
          <div class="card-main-content">
            <span class="unit">￥</span>
            <vab-count
              :start-val="countConfig.startVal"
              :end-val="card.volume"
              :duration="countConfig.duration"
              :decimals="countConfig.decimals"
            />
          </div>
        </el-card>
      </el-col>

      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <router-link :to="item.link" target="_blank">
          <el-card class="icon-panel" shadow="never">
            <vab-icon
              :style="{ color: item.color }"
              :icon="['fas', item.icon]"
            ></vab-icon>
            <p>{{ item.title }}</p>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
    <el-row>
      <div class="title-content">
        <span class="title">数据统计</span>
      </div>
      <div class="checkbox-content time-select">
        <select-date @setDateEmit="setDateEmit" />
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
        <el-card shadow="never">
          <div slot="header">
            <span>订单数据</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="orderOption"
          />
          <div class="bottom">
            <span
              >总订单量：
              <vab-count
                :start-val="countConfig.startVal"
                :end-val="allOrdersCount"
                :duration="countConfig.duration"
                :decimals="Number('0')"
              />
            </span>
            <span>
              日均：
              <vab-count
                :start-val="countConfig.startVal"
                :end-val="avarageOrder"
                :duration="countConfig.duration"
                :decimals="Number('0')"
              />
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
        <el-card shadow="never">
          <div slot="header">
            <span>营业额</span>
          </div>
          <vab-chart
            :autoresize="true"
            theme="vab-echarts-theme"
            :options="volumeOption"
          />
          <div class="bottom">
            <span
              >总营业额：
              <vab-count
                :start-val="Number('0')"
                :end-val="allVolume"
                :duration="Number('1000')"
                :decimals="Number('2')"
              />
            </span>
            <span>
              日均：
              <vab-count
                :start-val="Number('0')"
                :end-val="avarageVolume"
                :duration="Number('1000')"
                :decimals="Number('2')"
              />
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VabChart from "@/plugins/echarts";
import SelectDate from "@/components/SelectDate";
import { getDataPreview, getOrderStatistics } from "@/api/order";

export default {
  name: "Analyse",
  components: {
    VabChart,
    SelectDate,
  },
  data() {
    return {
      volumeData: [],
      orderData: [],
      salesData: [],
      allOrdersCount: 0,
      allVolume: 0,
      getStatisticLen: 0,
      countConfig: {
        startVal: 0,
        decimals: 2,
        duration: 2000,
      },
      chartOption: {
        grid: {
          top: "8%",
          left: "2%",
          right: "4%",
          bottom: "0%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            // name: ,
          },
        ],
      },
      //卡片图标
      iconList: [
        {
          icon: "book",
          title: "订单列表",
          link: "/data/order",
          color: "#69c0ff",
        },

        {
          icon: "coffee",
          title: "敬请期待",
          link: "",
          color: "#95de64",
        },
      ],
    };
  },
  computed: {
    orderOption() {
      return Object.assign({}, this.chartOption, {
        dataset: {
          source: [["date", "有效订单"]].concat(this.orderData),
        },
        series: [
          {
            name: "有效订单",
            type: "line",
            smooth: true,
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      });
    },
    volumeOption() {
      return Object.assign({}, this.chartOption, {
        dataset: {
          source: [["date", "销售额"]].concat(this.volumeData),
        },
        series: [
          {
            name: "销售金额",
            type: "bar",
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      });
    },

    avarageOrder() {
      return this.getStatisticLen
        ? Math.round(this.allOrdersCount / this.getStatisticLen)
        : 0;
    },
    avarageVolume() {
      return this.getStatisticLen
        ? Math.round((this.allVolume / this.getStatisticLen) * 100) / 100
        : 0;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async setDateEmit(dates) {
      const { data } = await getOrderStatistics(dates);
      this.getStatisticLen = Math.ceil(
        (dates[1] - dates[0]) / (3600 * 1000 * 24)
      );
      let allOrdersCount = 0,
        allVolume = 0;

      this.orderData = data.map((e) => {
        allOrdersCount += e.orderCount;
        return [e.date, e.orderCount];
      });
      this.volumeData = data.map((e) => {
        allVolume += e.volume;
        return [e.date, e.volume];
      });
      this.allOrdersCount = allOrdersCount;
      this.allVolume = allVolume;
    },
    async fetchData() {
      const Loading = this.$baseColorfullLoading(1);
      const today = new Date().toLocaleDateString();
      const Now = new Date().getTime();
      const Zero = new Date(today).getTime();
      const theWeek =
        Zero - ((new Date().getDay() || 7) - 1) * 24 * 3600 * 1000;
      const theMonth = Zero - (new Date().getDate() - 1) * 24 * 3600 * 1000;
      const parames = [
        [Zero, Now],
        [theWeek, Now],
        [theMonth, Now],
      ];
      const { data } = await getDataPreview({ parames });
      const labelList = ["日销售额", "周销售额", "月销售额"];
      this.salesData = data.map((e, index) => {
        return {
          label: labelList[index],
          volume: e[0].volume || 0,
          orderCount: e[0].orderCount || 0,
        };
      });
      setTimeout(() => {
        Loading.close();
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.index-container {
  padding: 0 !important;
  margin: 0 !important;
  background: #f5f7f8 !important;
  .title-content {
    font-size: 20px;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    margin-bottom: 12px;
  }
  .card-header-content {
    display: flex;
    justify-content: space-between;
    .order-count {
      color: #606266;
    }
  }
  .card-main-content {
    margin: 24px 0;
    font-size: 36px;
    color: #41b584;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    .unit {
      font-size: 20px;
      color: #606266;
    }
  }
  ::v-deep {
    .el-card__body {
      .echarts {
        width: 100%;
        height: 260px;
      }
    }
  }

  .bottom {
    padding-top: 20px;
    margin-top: 5px;
    color: #595959;
    text-align: left;
    border-top: 1px solid $base-border-color;
    span {
      padding-right: 12px;
    }
  }

  .icon-panel {
    height: 117px;
    text-align: center;
    cursor: pointer;

    svg {
      font-size: 40px;
    }

    p {
      margin-top: 10px;
    }
  }
}
</style>
