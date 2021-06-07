<template lang="pug">
vab-count(
  :start-val="countConfig.startVal",
  end-val="2000",
  :duration="countConfig.duration",
  :decimals="countConfig.decimals"
)
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    countConfig() {
      return {
        startVal: 0,
        decimals: 2,
        duration: 2000,
      };
    },
  },
};
</script>>