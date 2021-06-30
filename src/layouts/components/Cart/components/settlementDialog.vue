<template>
  <el-dialog title="结算" :visible.sync="dialogFormVisible" width="640px" @close="close">
    <div class="amount-money">
      <p>总消费金额： {{ computedPrice }}</p>
    </div>
    <el-divider content-position="left" v-if="selectedVip">选择支付方式</el-divider>
    <div class="payment-type-content" v-if="selectedVip">
      <div
        class="balance-pay pay-method-item"
        :class="payMethod === 'balance-pay' ? 'active' : ''"
        @click="selectPayMethod('balance-pay')"
      >
        <p class="title">余额支付（推荐）</p>
        <i class="originValue" v-show="payMethod === 'balance-pay'">{{ selectedVip.balance }}</i>
        <span>{{ afterBalance }}</span>
      </div>
      <div
        class="integral-pay pay-method-item"
        :class="payMethod === 'integral-pay' ? 'active' : ''"
      >
        <p class="title">积分抵扣（暂不支持）</p>
        <i class="originValue" v-show="payMethod === 'integral-pay'">{{ selectedVip.integral }}</i>
        <span>{{ selectedVip.integral }}</span>
      </div>
    </div>
    <el-divider content-position="left">待支付</el-divider>
    <div class="direct-pay">
      <!-- <p>待支付：</p> -->
      <div class="direct-pay-value">
        <span class="unit">￥</span>
        <vab-count
          :start-val="Number('0')"
          :end-val="surplusPayment"
          :duration="Number('500')"
          :decimals="Number('2')"
        />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { scaleTwoPrice } from '@/utils/price.js';
export default {
  name: 'settlementDialog',
  props: {
    computedPrice: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      payMethod: '',
    };
  },
  computed: {
    ...mapGetters({
      selectedVip: 'vip/getSelectedVip',
      privilege: 'privilege/getPrivilege',
    }),
    balancePay() {
      if (this.payMethod === 'balance-pay') {
        return scaleTwoPrice(
          this.selectedVip.balance >= this.computedPrice
            ? this.computedPrice
            : this.selectedVip.balance,
        );
      } else {
        return 0;
      }
    },
    afterBalance() {
      if (this.payMethod === 'balance-pay') {
        return scaleTwoPrice(
          this.selectedVip.balance >= this.computedPrice
            ? this.selectedVip.balance - this.computedPrice
            : 0,
        );
      } else {
        return this.selectedVip.balance;
      }
    },
    surplusPayment() {
      if (this.payMethod === 'balance-pay') {
        return scaleTwoPrice(
          this.selectedVip.balance >= this.computedPrice
            ? 0
            : this.computedPrice - this.selectedVip.balance,
        );
      } else {
        return this.computedPrice;
      }
    },
    // 计算积分
    computedIntegral() {
      const _integral = this.selectedVip
        ? Math.floor(this.computedPrice / this.privilege.cost_unit) * this.privilege.integrals
        : 0;
      return this.selectedVip.integral + _integral;
    },
  },
  methods: {
    ...mapActions({
      updateBalance: 'vip/updateBalance',
    }),
    showEdit() {
      this.dialogFormVisible = true;
    },
    close() {
      this.payMethod = '';
      this.dialogFormVisible = false;
    },
    selectPayMethod(type) {
      this.payMethod = this.payMethod === type ? '' : type;
    },
    async submit() {
      // 支付确认
      await this.$emit('resetStock', {
        payMethod: this.payMethod,
        balancePay: this.balancePay,
        surplusPayment: this.surplusPayment,
        PN: this.selectedVip?.PN,
      });
      //修改余额
      this.selectedVip &&
        this.updateBalance({
          balance: this.afterBalance,
          integral: this.computedIntegral,
          uuid: this.selectedVip.uuid,
        });
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-money {
  margin-bottom: 30px;
}
.payment-type-content {
  display: flex;
  justify-content: center;
  height: 82px;
  margin-bottom: 30px;
  .pay-method-item {
    flex: 200px 0 0;
    margin: 0 8px;
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 4px 16px 8px;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    .title {
    }
    .originValue {
      text-decoration: line-through;
      //   color: #606266;
      font-size: 12px;
      padding-right: 6px;
      font-weight: normal;
    }
    &.balance-pay {
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;
      &.active {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
    &.integral-pay {
      // color: #e6a23c;
      // background: #fdf6ec;
      // border-color: #f5dab1;
      color: #909399;
      background: #f4f4f5;
      border-color: #d3d4d6;
      cursor: not-allowed;
      // &.active {
      //   color: #fff;
      //   background-color: #e6a23c;
      //   border-color: #e6a23c;
      // }
    }
  }
}
.direct-pay-value {
  font-size: 36px;
  color: #41b584;
  font-weight: bold;
  font-style: italic;
  // text-align: center;
  .unit {
    font-size: 20px;
    color: #606266;
  }
}
</style>