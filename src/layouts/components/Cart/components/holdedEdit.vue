<template>
  <el-dialog
    title="挂起订单列表"
    :visible.sync="dialogFormVisible"
    width="640px"
    @close="close"
  >
    <div class="order-cache-card-content">
      <el-row :gutter="20">
        <template v-if="holdedList.length">
          <el-col :span="12" v-for="order in holdedList" :key="order.time">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ order.time | timeFilter }}</span>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="delOrderCache(order)"
                >
                  <el-button
                    slot="reference"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                  ></el-button>
                </el-popconfirm>
                <el-popconfirm
                  v-if="getCartList.length"
                  title="覆盖购物车的商品,确定吗？"
                  @confirm="useThisCache(order.list)"
                >
                  <el-button
                    slot="reference"
                    size="mini"
                    type="success"
                    icon="el-icon-check"
                    circle
                  ></el-button>
                </el-popconfirm>
                <el-button
                  v-else
                  size="mini"
                  type="success"
                  icon="el-icon-check"
                  circle
                  plain
                  @click="useThisCache(order)"
                ></el-button>
              </div>
              <div
                v-for="item in order.list"
                :key="item.uuid"
                class="text item"
              >
                {{ item.name + "*" + item.saled }}
              </div>
            </el-card>
          </el-col>
        </template>

        <el-col :span="24" v-else>
          <p>暂无挂起订单哦~</p>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        :disabled="!holdedList.length"
        @click="handleClearAllList"
        >清空全部</el-button
      >
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { successCode } from "@/config";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "discountEdit",
  filters: {
    timeFilter(NS) {
      return new Date(NS).toLocaleString();
    },
  },
  data() {
    return {
      form: {
        discount: "",
      },
      mode: "add",
      dialogFormVisible: false,
      preValue: [100, 95, 90, 88, 85, 80, 75, 70, 68, 65, 60, 50],
    };
  },
  computed: {
    ...mapGetters({
      allGoodsList: "goods/getGoodsList",
      orderCache: "cart/getOrderCache",
      getCartList: "cart/getCartList",
    }),
    holdedList() {
      return this.orderCache.map((e) => {
        return {
          ...e,
          list: JSON.parse(e.list),
        };
      });
    },
  },
  methods: {
    ...mapMutations({
      setCartList: "cart/setCartList",
      delOrderCache: "cart/delOrderCache",
      clearAllList: "cart/clearAllCache",
      clearCartlist: "cart/clearCartlist",
    }),
    showEdit() {
      this.discount !== 1 && (this.form.discount = this.discount * 100);
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
    },
    useThisCache(order) {
      // 购物车不为空时，清空并恢复库存
      this.getCartList.length && this.clearCartlist({ recoveryStock: true });
      // 与当前库存merged
      const mergedList = this.mergeCurrentGoodsInfo(order.list);
      this.setCartList(mergedList);
      this.close();
      // 应用之后删除这条记录
      this.delOrderCache(order);
    },
    // 清空全部
    handleClearAllList() {
      this.$baseConfirm("清空后不可恢复，确定清空吗？", null, () => {
        this.clearAllList();
        this.close();
      });
    },
    mergeCurrentGoodsInfo(list) {
      const myList = [];
      list.forEach((item) => {
        this.allGoodsList.forEach((e) => {
          if (e.uuid === item.uuid) {
            e.saled = item.saled;
            myList.push(e);
          }
        });
      });
      return myList;
    },
  },
};
</script>
<style lang="scss" scoped>
.order-cache-card-content {
  height: 440px;
  overflow-y: auto;
  overflow-x: hidden;
}
::v-deep {
  .el-card__header {
    padding: 10px 20px;
    line-height: 28px;
  }
}
.clearfix {
  display: flex;
  justify-content: space-between;
}
</style>
