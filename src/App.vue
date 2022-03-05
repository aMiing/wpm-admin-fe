<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {},
};
</script>
<style lang="scss">
@import './styles/fonts/fonts.css';
* {
  box-sizing: border-box;
}
.record-info {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 6px 0;
  // font-weight: bold;
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
