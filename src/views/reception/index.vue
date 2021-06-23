<template>
  <div class="reception">
    <div class="vab-main">
      <div class="fixed-header">
        <vab-nav-bar mode="simple" />
      </div>
      <div class="top-menu">
        <div
          class="menu-content"
          v-for="(item, index) in topMenuList"
          :key="index"
          @click="handleClickMenu(item)"
        >
          <vab-icon :icon="['fas', item.icon]"></vab-icon>
          <span class="menu-name"> {{ item.name }} </span>
        </div>
      </div>
      <vab-ad />
    </div>
    <div class="reception-main">
      <div class="cart-content">
        <cart class="hidden-xs-only" />
      </div>
      <div class="goods-content">
        <div class="tab-content">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane
              :label="type.label"
              :name="type.label"
              v-for="(type, index) in allTypes"
              :key="index"
            >
              <div class="tab-pannel-content">
                <el-row :gutter="20">
                  <el-col
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :lg="6"
                    :xl="6"
                    v-for="goods in list"
                    :key="goods.uuid"
                  >
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <div class="card-body" @click="addToCart(goods)">
                        <h3 class="goods-name">{{ goods.name }}</h3>
                        <p class="goods-info-qrNumber">
                          <span>库存：{{ goods.stock }}</span>
                          <el-input-number
                            v-show="false"
                            v-model="goods.saled"
                            :min="0"
                            :step="1"
                            step-strictly
                          ></el-input-number>
                        </p>
                        <div class="bottom floatRight">
                          <span class="price">￥{{ goods.price }}</span>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      activeName: '',
      topMenuList: [
        {
          name: '零售',
          icon: 'store',
          link: '',
        },
        {
          name: '新增会员',
          icon: 'user-plus',
          link: '/vip/list?operate=add',
        },
        {
          name: '次卡消费',
          icon: 'id-card',
          link: '',
        },
        {
          name: '销售查询',
          icon: 'calendar-alt',
          link: '/data/order',
        },
        {
          name: '交接班',
          icon: 'exchange-alt',
          link: '',
        },
        {
          name: '历史订单',
          icon: 'book-reader',
          link: '/data/order',
        },
        {
          name: '库存查询',
          icon: 'truck',
          link: '/goods/stock',
        },
        {
          name: '更多功能',
          icon: 'th-large',
          link: '/goods/index',
        },
        {
          name: '后台管理',
          icon: 'tv',
          link: '/data/analyse',
        },
        {
          name: '系统设置',
          icon: 'cog',
          link: '/management/systemInfo',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      allTypes: 'goods/getAllTypes',
      list: 'goods/getFiltList',
    }),
  },
  watch: {
    activeName(val) {
      const params = {
        filtType: [{ label: val, select: true }],
      };
      val && this.getFiltData(params);
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    ...mapMutations({
      clearCartlist: 'cart/clearCartlist',
      getFiltData: 'goods/getFiltData',
      addCartItem: 'cart/addCartItem',
    }),
    ...mapActions({
      setGoodsList: 'goods/setGoodsList',
    }),
    handleClickMenu(item) {
      if (item.link) {
        this.$router.push(item.link);
      } else {
        console.log(item.name);
      }
    },
    async fetchData() {
      const Loading = this.$baseColorfullLoading(1);
      await this.setGoodsList();
      Loading.close();
    },
    addToCart(row) {
      if (row.stock === 0) {
        this.$baseMessage('库存不足！', 'error');
        return false;
      }
      row.stock -= 1;
      row.saled = !row.saled ? 1 : Number(row.saled) + 1;
      this.addCartItem(row);
    },
  },
};
</script>
<style lang="scss" scoped>
.reception {
  position: absolute;
  width: 100%;
  height: 100%;

  ::v-deep {
    .nav-bar-container {
      height: 30px;
      background-color: #409eff;
      color: #fff;
      .left-panel,
      .right-panel {
        height: 30px !important;
        svg {
          color: #fff;
        }
        .user-name {
          color: #fff;
        }
      }
    }
  }
  .top-menu {
    display: flex;
    justify-content: flex-start;
    background-color: #409eff;
    .menu-content {
      display: flex;
      flex-direction: column;
      flex-basis: 100px;
      text-align: center;
      padding: 12px 6px 6px;
      color: #fff;
      cursor: pointer;
      &:hover {
        color: #eee;
      }
      svg {
        font-size: 30px;
        margin: 0 auto;
      }
      .menu-name {
        margin-top: 8px;
        line-height: 24px;
      }
    }
  }
  .reception-main {
    width: 100%;
    height: calc(100% - 110px);
    display: flex;
    .cart-content {
      position: relative;
      width: 441px;
      height: 100%;
      flex-shrink: 0;
      flex-grow: 0;
    }
    .goods-content {
      flex: 1;
      overflow: hidden;
      padding: 0 16px 16px;
      .tab-content {
        .card-body {
          padding: 8px 16px;
          cursor: pointer;
        }
        .bottom {
          font-size: 18px;
          font-weight: bold;
          color: #f56c6c;
        }
        .floatRight {
          text-align: right;
        }
      }
    }
  }
}
</style>