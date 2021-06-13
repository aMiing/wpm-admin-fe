<template>
  <span>
    <vab-icon
      title="已选"
      :icon="['fas', 'shopping-cart']"
      @click="handleOpenThemeBar"
    ></vab-icon>
    <div class="theme-bar-setting">
      <div @click="handleOpenThemeBar">
        <vab-icon :icon="['fas', 'shopping-cart']"></vab-icon>
        <p>已选</p>
      </div>
    </div>

    <el-drawer
      title="已选列表"
      :visible.sync="drawerVisible"
      direction="rtl"
      append-to-body
      size="500px"
    >
      <div class="custom-drawer-content">
        <div class="el-drawer__body">
          <el-table ref="tableSort" :data="cartList" :max-height="tableHeight">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="名称"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="图片">
              <template #default="{ row }">
                <el-image
                  :preview-src-list="imageList"
                  :src="row.img"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="price"
              label="单价"
            ></el-table-column>
            <el-table-column label="购买数量" width="160px">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.saled"
                  :min="0"
                  :max="row.stock"
                  :step="1"
                  step-strictly
                  @change="addedChange(row)"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="custom-count">
          <span>
            数量： <i class="custom-count-num">{{ allcartCount }}</i> 件/次，
            总价 <i class="custom-count-price">{{ allPayPrice }}</i> 元
          </span>
          <el-button>打折</el-button>
          <el-tooltip content="清空已选" placement="top" effect="light">
            <el-button
              icon="el-icon-delete"
              circle
              @click="clearCart()"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="submit-btn-box" v-show="allcartCount">
          <el-button
            type="primary"
            size="medium"
            :loading="saveLoading"
            @click="resetStock"
          >
            确认售出并更新库存
          </el-button>
        </div>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import { resetStock } from "@/api/table";
import { createOrder } from "@/api/order";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { successCode } from "@/config";
export default {
  name: "cart",
  data() {
    return {
      tableHeight: 200,
      drawerVisible: false,
      imageList: [],
      saveLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      cartList: "cart/getCartList",
      username: "user/username",
    }),
    allcartCount() {
      return this.cartList.reduce((total, item) => (total += item.saled), 0);
    },
    allPayPrice() {
      return this.cartList.reduce(
        (total, item) => (total += item.price * item.saled),
        0
      );
    },
  },

  async mounted() {
    await this.$nextTick();
    this.tableHeight = window.innerHeight - 200;
  },
  methods: {
    ...mapActions({
      setCartList: "cart/setCartList",
    }),
    ...mapMutations({
      addCartItem: "cart/addCartItem",
      delCartItem: "cart/delCartItem",
      clearCartlist: "cart/clearCartlist",
      resetStockStore: "goods/resetStock",
    }),
    addedChange(row) {
      if (Number(row.saled) === 0) {
        this.$baseConfirm(
          "你确定要移除当前商品吗",
          null,
          () => {
            this.delCartItem(row);
          },
          () => {
            row.saled = 1;
          }
        );
      } else this.addCartItem(row);
    },
    // 清空购物车
    clearCart() {
      this.$baseConfirm("清空购物车？", null, () => {
        this.clearCartlist();
      });
    },
    // 更新库存
    async resetStock() {
      try {
        const { msg, code } = await resetStock(this.cartList);
        await createOrder({
          allPayPrice: this.allPayPrice,
          salesperson: this.username,
          purchase: this.cartList,
        });
        this.$baseMessage(msg, "success");
        if (successCode.includes(code)) {
          // 修改store
          this.resetStockStore(this.cartList);
          this.drawerVisible = false;
          this.clearCartlist();
        }
      } catch (err) {
        this.$baseMessage(err, "error");
      }
    },
    handleOpenThemeBar() {
      this.drawerVisible = true;
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

.el-drawer__body {
  padding-bottom: 20px;
  margin-top: 64px;
}
.custom-drawer-content {
  width: 100%;
  height: calc(100% - 77px);
  position: absolute;
}
.custom-count {
  height: 64px;
  line-height: 32px;
  padding: 16px;
  font-size: 16px;
  position: absolute;
  top: 0;
  width: 100%;
  background: #f2f6fc;
  color: #303133;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
  i.custom-count-price {
    color: #f56c6c;
    font-weight: 800;
    font-size: 20px;
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
</style>
