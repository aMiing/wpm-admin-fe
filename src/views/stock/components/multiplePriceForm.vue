<template>
  <div class="multiplePriceForm">
    <div class="form-title">
      <span>阶梯计价规则：(前包含后不包含)</span>
      <el-button icon="el-icon-plus" size="mini" round type="text" @click="handleAdd" />
    </div>
    <el-form ref="form" label-width="auto" label-suffix=":">
      <el-form-item v-for="(rule, index) in rules" :key="rule.id" :label="'规则' + index">
        <div class="rule-item-content">
          <span>从</span>
          <el-input-number
            v-model.number="rule.unitRange[0]"
            disabled
            :controls="false"
            size="mini"
            type="number"
            :max="rule.unitRange[1]"
          />
          <span>单位到</span>
          <el-input-number
            v-model.number="rule.unitRange[1]"
            :controls="false"
            size="mini"
            :min="rule.unitRange[0]"
            @change="maxRangeChange(index)"
          />
          <span>单位，价格为:</span>
          <el-input-number v-model.number="rule.price" :controls="false" size="mini" />
          <span>元</span>
          <div class="operation-box">
            <el-button
              v-show="index > 0"
              icon="el-icon-minus"
              size="mini"
              circle
              @click="handleDelete(rule)"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MultiplePriceForm',
  props: {
    priceRange: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rules: [],
    };
  },
  mounted() {
    this.mergePriceRange();
    // this.handleAdd();
  },
  methods: {
    mergePriceRange() {
      if (this.priceRange.length) {
        this.rules = [...this.priceRange];
      } else {
        this.rules.push({
          id: Math.random().toString(),
          unitRange: [0, 100],
          price: 0,
        });
      }
    },
    handleAdd() {
      const lastRange = this.rules[this.rules.length - 1].unitRange;
      const newRange = [lastRange[1] || 0, 2 * lastRange[1] - lastRange[0] || 100];
      this.rules.push({
        id: Math.random().toString(),
        unitRange: newRange,
        price: 0,
      });
    },
    handleDelete(rule) {
      const index = this.rules.findIndex(e => e === rule);
      this.rules.splice(index, 1);
    },
    maxRangeChange(index) {
      if (this.rules[index + 1]) {
        this.rules[index + 1].unitRange[0] = this.rules[index].unitRange[1];
      }
    },
    // 提供給外部的可靠數據
    validateData() {
      if (this.rules.length) {
        if (this.rules[0].price === 0) return false;
        return [...this.rules];
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-title {
  display: flex;
}
.rule-item-content {
  display: flex;
  .operation-box {
    flex-grow: 1;
    text-align: center;
  }
}
::v-deep {
  .el-form {
    padding-right: 0 !important;
  }
  .el-input-number--mini {
    width: 50px;
    margin: 0 4px;
  }
  .el-input--mini .el-input__inner {
    padding: 0 9px;
    text-align: center;
  }
}
</style>
