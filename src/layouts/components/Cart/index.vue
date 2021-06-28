<template>
  <div class="cart-main">
    <div class="custom-drawer-content">
      <div class="custom-drawer-body">
        <el-table ref="tableSort" :data="cartList" :min-height="tableHeight">
          <el-table-column show-overflow-tooltip prop="name" label="商品"></el-table-column>
          <el-table-column label="数量" min-width="120px">
            <template #default="{ row }">
              <!-- <span>{{ row.saled }}</span> -->
              <el-input-number
                v-model="row.saled"
                :min="0"
                :step="1"
                step-strictly
                @change="(current, oldV) => addedChange(row, current - oldV)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="单价"></el-table-column>

          <el-table-column show-overflow-tooltip label="小计">
            <template #default="{ row }">
              <span class="littleCount">
                {{ row.price * row.saled }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="custom-count">
        <span>
          共<i class="custom-count-num">{{ allcartCount }}</i> 件
        </span>
        <span class="discount-show-detail" v-show="discount !== 1">
          折扣：{{ originPayPrice }} <i>×</i> {{ discount }}
        </span>
        <span>
          <span class="changedPrice" v-show="changedPrice !== ''">
            {{ allPayPrice }}
          </span>
          <i class="custom-count-price">{{ computedPrice }}</i>
          元
        </span>
      </div>
      <div class="vip-info" v-if="selectedVip">
        <div class="vip-info-name-content">
          <span>
            会员：<i class="vip-info-name">{{ selectedVip.PN || selectedVip.name || '' }}</i>
          </span>
        </div>
        <div class="vip-info-common-content">
          <span>
            会员余额：<i class="vip-info-common-volume">{{ selectedVip.balance }}</i>
          </span>
          <span>
            积分：<i class="vip-info-common-score">{{ selectedVip.integral }}</i>
          </span>
        </div>
      </div>
    </div>

    <div class="cart-right">
      <div class="operate-content">
        <div class="operate-btn" v-for="operate in cartOperates" :key="operate.type">
          <el-badge
            :value="orderCache.length"
            class="item"
            v-if="operate.bedge && orderCache.length"
          >
            <el-button
              size="medium"
              type="primary"
              :icon="operate.icon"
              @click="handleOperate(operate.type)"
              >{{ operate.name }}</el-button
            >
          </el-badge>

          <el-button
            v-else
            size="medium"
            type="primary"
            :icon="operate.icon"
            @click="handleOperate(operate.type)"
            >{{ operate.name }}</el-button
          >
        </div>
      </div>
      <div class="settlement">
        <el-button type="danger" size="medium" @click="handleOperate('settlement')">结算</el-button>
      </div>
    </div>
    <discount-edit ref="discountEdit" />
    <change-price ref="changePrice" />
    <holded-edit ref="holdedEdit" />
    <vip-list ref="vipList" />
    <settlement-dialog
      ref="settlementDialog"
      :computedPrice="computedPrice"
      @resetStock="resetStock"
    />
  </div>
</template>

<script>
import { resetStock } from '@/api/table';
import { createOrder } from '@/api/order';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { successCode } from '@/config';
import ChangePrice from './components/changePrice.vue';
import DiscountEdit from './components/discountEdit.vue';
import HoldedEdit from './components/holdedEdit.vue';
import VipList from './components/vipList.vue';
import SettlementDialog from './components/settlementDialog.vue';
import { scaleTwoPrice } from '@/utils/price.js';
export default {
  name: 'cart',
  components: { DiscountEdit, ChangePrice, HoldedEdit, VipList, SettlementDialog },
  data() {
    return {
      tableHeight: 200,
      imageList: [],
      saveLoading: false,
      cartOperates: [
        {
          name: '清空',
          icon: 'el-icon-delete',
          type: 'clearAll',
        },
        {
          name: '折扣',
          icon: '',
          type: 'discount',
        },
        {
          name: '改价',
          icon: 'el-icon-s-release',
          type: 'changePrice',
        },
        {
          name: '赠送',
          icon: 'el-icon-s-promotion',
          type: 'give',
        },
        {
          name: '挂单',
          icon: 'el-icon-star-off',
          type: 'holdon',
        },
        {
          name: '会员',
          icon: 'el-icon-s-custom',
          type: 'vip',
        },
        {
          name: '挂单列表',
          icon: '',
          type: 'holded',
          bedge: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      cartList: 'cart/getCartList',
      username: 'user/username',
      discount: 'cart/getDiscount',
      changedPrice: 'cart/getChangedPrice',
      orderCache: 'cart/getOrderCache',

      selectedVip: 'vip/getSelectedVip',
    }),
    allcartCount() {
      return scaleTwoPrice(this.cartList.reduce((total, item) => (total += item.saled), 0));
    },
    originPayPrice() {
      return scaleTwoPrice(
        this.cartList.reduce((total, item) => (total += item.price * item.saled), 0),
      );
    },
    allPayPrice() {
      return scaleTwoPrice(this.originPayPrice * this.discount);
    },
    computedPrice() {
      return scaleTwoPrice(this.changedPrice || this.allPayPrice);
    },
  },

  async mounted() {
    await this.$nextTick();
    this.tableHeight = window.innerHeight - 200;
  },
  methods: {
    ...mapActions({
      setCartList: 'cart/setCartList',
    }),
    ...mapMutations({
      addCartItem: 'cart/addCartItem',
      delCartItem: 'cart/delCartItem',
      clearCartlist: 'cart/clearCartlist',
      resetStockStore: 'goods/resetStock',
      setChangedPrice: 'cart/setChangedPrice',
      addOrderCache: 'cart/addOrderCache',
    }),
    addedChange(row, add) {
      if (Number(row.saled) === 0) {
        this.$baseConfirm(
          '你确定要移除当前商品吗',
          null,
          () => {
            row.stock -= add;
            this.delCartItem(row);
          },
          () => {
            row.saled = 1;
          },
        );
      } else {
        row.stock -= add;
        this.addCartItem(row);
      }
    },
    // 更新库存
    async resetStock(params = {}) {
      try {
        const { msg, code } = await resetStock(this.cartList);
        await createOrder(
          Object.assign(params, {
            discount: this.discount,
            salesperson: this.username,
            purchase: this.cartList,
            originPayPrice: this.originPayPrice,
            realPayPrice: this.computedPrice,
          }),
        );
        this.$baseMessage(msg, 'success');
        if (successCode.includes(code)) {
          this.clearCartlist();
          // 清空会员信息
          this.selectedVip && this.$refs.vipList.cancelSelect();
        }
      } catch (err) {
        this.$baseMessage(err, 'error');
      }
    },

    // 操作组操作
    handleOperate(type) {
      if (!this.cartList.length && !['holded', 'vip'].includes(type)) {
        this.$baseMessage('请先加入购物车！', 'warning');
        return false;
      }
      switch (type) {
        case 'clearAll':
          {
            this.$baseConfirm('清空购物车？', null, () => {
              this.clearCartlist({ recoveryStock: true });
            });
          }
          break;
        case 'discount':
          {
            this.$refs.discountEdit.showEdit();
          }
          break;

        case 'changePrice':
          {
            this.$refs.changePrice.showEdit();
          }
          break;

        case 'give':
          {
            this.$baseConfirm('确定赠送吗？', null, async () => {
              await this.setChangedPrice(0);
              this.resetStock();
            });
          }
          break;

        case 'holdon':
          {
            if (this.orderCache.length >= 10) {
              this.$baseMessage('挂单不能超过10个哦', 'error');
              return;
            }
            this.$baseConfirm('确定挂单吗？', null, async () => {
              this.addOrderCache();
              this.clearCartlist();
            });
          }
          break;
        case 'holded':
          {
            this.$refs.holdedEdit.showEdit();
          }
          break;

        case 'vip':
          {
            this.$refs.vipList.showEdit();
          }
          break;
        case 'settlement':
          {
            // 如果是会员，可选择余额支付、积分支付、直接支付；非会员直接支付
            this.$refs.settlementDialog.showEdit();
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin right-bar {
  position: fixed;
  right: 0;
  z-index: $base-z-index;
  width: 60px;
  min-height: 60px;
  text-align: center;
  cursor: pointer;
  background: $base-color-blue;
  border-radius: $base-border-radius;

  > div {
    padding-top: 10px;
    border-bottom: 0 !important;

    &:hover {
      opacity: 0.9;
    }

    & + div {
      border-top: 1px solid $base-color-white;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: $base-font-size-small;
      line-height: 30px;
      color: $base-color-white;
    }
  }
}

.theme-bar-setting {
  @include right-bar;

  top: calc((100vh - 110px) / 2);

  ::v-deep {
    svg:not(:root).svg-inline--fa {
      display: block;
      margin-right: auto;
      margin-left: auto;
      color: $base-color-white;
    }

    .svg-icon {
      display: block;
      margin-right: auto;
      margin-left: auto;
      font-size: 20px;
      color: $base-color-white;
      fill: $base-color-white;
    }
  }
}
.cart-main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .custom-drawer-content {
    flex-basis: 360px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    .custom-drawer-body {
      flex: 1;
    }
  }

  .cart-right {
    flex-basis: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid #409eff;
    .operate-content {
      ::v-deep {
        .el-button--medium {
          text-align: center;
          padding: 15px;
          margin: 0 0 6px 0;
          width: 80px;
        }
      }
    }
    .settlement {
      ::v-deep {
        .el-button--medium {
          padding: 18px 20px;
          margin: 0;
          width: 80px;
        }
      }
    }
  }
}
.custom-count {
  height: 48px;
  line-height: 32px;
  padding: 8px 6px;
  font-size: 16px;
  width: 100%;
  background: #f2f6fc;
  color: #303133;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e4e7ed;
  font-weight: 800;
  i.custom-count-price {
    color: #f56c6c;
    font-size: 24px;
  }
}
.vip-info {
  background: #f2f6fc;
  color: #303133;
  line-height: 24px;
  padding: 0 6px 4px;
  font-size: 14px;
  .vip-info-common-content {
    display: flex;
    justify-content: space-between;
  }
}
.submit-btn-box {
  text-align: center;
}
</style>
<style lang="scss">
.el-drawer__wrapper {
  outline: none !important;
  * {
    outline: none !important;
  }
}
.vab-color-picker {
  .el-color-dropdown__link-btn {
    display: none;
  }
}

.el-input-number--small {
  width: 100px;
}
.discount-show-detail,
.changedPrice {
  color: #909399;
  font-size: 14px;
  font-weight: normal;
}
.changedPrice {
  text-decoration: line-through;
}
</style>
