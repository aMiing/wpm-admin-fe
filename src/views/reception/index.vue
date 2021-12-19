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
          <el-tabs v-model="activeTypeId" type="card">
            <el-tab-pane
              :label="type.name"
              :name="type.uuid"
              v-for="(type, index) in allTypes"
              :key="index"
            >
              <div class="tab-panne-content">
                <el-row :gutter="20" v-if="(dataByType[activeTypeId] || []).length">
                  <el-col
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :lg="6"
                    :xl="6"
                    v-for="goods in dataByType[activeTypeId]"
                    :key="goods.uuid"
                  >
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <div slot="header" class="clearfix">
                        <strong>{{ goods.name + (goods.online === 2 ? '（已下架）' : '') }}</strong>
                        <el-tag
                          v-if="goods.measureType === 'weight'"
                          size="mini"
                          style="float: right"
                          effect="plain"
                        >
                          称重
                        </el-tag>
                        <el-tag v-else size="mini" style="float: right" type="info" effect="plain">
                          计数
                        </el-tag>
                      </div>
                      <div
                        class="card-body"
                        :class="(goods.online === 2 || goods.stock === 0) && 'disabled'"
                        @click="addToCart(goods)"
                      >
                        <div class="goods-info-qrcode">
                          <span>条码：{{ goods.qrcode || '--' }}</span>
                        </div>
                        <p class="goods-info-stock">
                          <span>库存：{{ goods.stock + (goods.unit ? goods.unit : '') }}</span>
                          <!-- 不可删除，会引起试图更新问题 -->
                          <el-input-number
                            v-show="false"
                            v-model="goods.saled"
                            :min="0"
                            :step="1"
                            :precision="3"
                          ></el-input-number>
                        </p>
                        <div class="bottom floatRight">
                          <span class="price" v-if="goods.priceRange"
                            >￥{{ goods.priceRange | priceRangeFilter }}</span
                          >
                          <span class="price" v-else>￥{{ goods.price }}</span>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <el-empty v-else description="该分类下暂无商品">
                  <el-button type="primary" @click="handleClickMenu({ link: '/goods/create' })"
                    >去创建</el-button
                  >
                </el-empty>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="qrcode-input">
          <div v-if="currentWeight" class="weight-content">
            <span>{{ currentWeight }}<i style="font-size: 24px">kg</i></span>
          </div>
          <el-button v-else size="medium" type="info" @click="getSerialPort">连接电子秤</el-button>
          <el-form label-width="80px" @keyup.enter.native="qrcodeKeyUp">
            <el-form-item label="条码输入:">
              <el-input
                v-model="searchQRcode"
                autofocus
                placeholder="请输入或扫描商品条形码,按enter键确认"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { getList } from '@/api/table';
import { topMenuList } from './config';
import mixin from './mixin';

export default {
  mixins: [mixin],
  filters: {
    priceRangeFilter(list) {
      list = JSON.parse(list);
      let res = list[0].price;
      if (list.length > 1) {
        res = list[list.length - 1].price + '~' + res;
      }
      return res;
    },
  },
  data() {
    return {
      topMenuList,
      searchQRcode: '',
      list: [],
      currentWeight: null,
      activeTypeId: '',
    };
  },

  computed: {
    ...mapGetters({
      allTypes: 'classification/getAllTypes',
      goodsList: 'goods/getGoodsList',
    }),
    // 不同分类下的商品数据
    dataByType() {
      const data = {};
      this.allTypes.forEach(e => {
        data[e.uuid] = this.goodsList.filter(goods => goods.type.split(',').includes(e.uuid));
      });
      return data;
    },
  },
  watch: {
    allTypes(val) {
      val.length && (this.activeTypeId = this.allTypes[0].uuid);
    },
  },

  created() {
    this.setTypeList();
    // 请求全部的商品数据
    this.setGoodsList();
  },
  methods: {
    ...mapMutations({
      addCartItem: 'cart/addCartItem',
    }),
    ...mapActions({
      setGoodsList: 'goods/setGoodsList',
      setTypeList: 'classification/setTypeList',
    }),
    handleClickMenu(item) {
      if (item.link) {
        this.$router.push(item.link);
      } else {
        console.log(item.name);
      }
    },
    //分类点击，通过分类id去查找对应的商品
    add(e) {
      getList({ type: e.name }).then(res => {
        this.list = res.data.data;
      });
    },
    addToCart(row) {
      if (row.online === 2) {
        this.$baseMessage('下架商品不可销售哦！', 'info');
        return false;
      }
      if (row.stock === 0) {
        this.$baseMessage('库存不足了哦！', 'error');
        return false;
      }
      if (row.measureType === 'weight') {
        if (!parseFloat(this.currentWeight)) {
          this.$baseMessage('商品重量不足或未放置商品！', 'error');
          return;
        }
        row.saled = parseFloat(this.currentWeight || '00.000');
      } else {
        row.stock -= 1;
        row.saled = !row.saled ? 1 : Number(row.saled) + 1;
      }
      this.addCartItem(row);
    },
    qrcodeKeyUp() {
      const row = this.getGoodsList.find(e => e.qrcode === this.searchQRcode);
      row && this.addToCart(row);
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
      // padding: 0 16px;
      position: relative;
      .tab-content {
        position: relative;
        height: calc(100% - 52px);
        overflow: hidden;
        padding: 0 16px;
        .card-body {
          padding: 8px 16px;
          cursor: pointer;
          &.disabled {
            cursor: not-allowed;
            opacity: 0.4;
          }
        }
        .bottom {
          font-size: 18px;
          font-weight: bold;
          color: #f56c6c;
        }
        .floatRight {
          text-align: right;
        }
        .goods-name {
          margin-bottom: 10px;
        }
        .goods-info-qrcode {
          font-size: 13px;
          color: #909399;
        }
      }
      .qrcode-input {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 4px 10px;
        background: #fff;
        border-top: 1px solid #ccc;
        z-index: 9;
        .weight-content {
          flex-basis: 180px;
          background: linear-gradient(to bottom right, #909399, rgb(196, 184, 196), #909399);
          height: 44px;
          line-height: 44px;
          border-radius: 4px;
          color: #fff;
          font-size: 38px;
          font-family: 'UnidreamLED';
          padding: 0 12px;
          letter-spacing: 0.1em;
          text-align: center;
        }
        /deep/ .el-form {
          width: 40%;
          max-width: 420px;
          min-width: 160px;
          .el-form-item {
            margin-bottom: 0;
          }
        }
      }
      /deep/ .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-tabs__content {
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
