<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- ‘保持状态’ -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Player from "components/player/player";
import router from '@/router/index'
export default {
  router,
  components: {
    "m-header": MHeader,
    tab: Tab,
    Player
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

#app {
  color: $color-theme;
}
</style>