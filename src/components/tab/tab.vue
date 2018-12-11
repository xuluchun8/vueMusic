<template>
  <div id="tab">
    <router-link tag="div" to="/recommend" class="item recommend" >
      <span>推荐</span> 
    </router-link>
    <router-link tag="div" to="/singer" class="item singer" >
      <span>歌手</span>
    </router-link>
    <router-link tag="div" to="/rank" class="item rank">
      <span>排行</span> 
    </router-link>
    <router-link tag="div" to="/search" class="item search">
      <span>搜索</span> 
    </router-link>
  </div>
</template>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable.styl';

#tab {
  margin-top: 5px;
  height: 44px;
  width: 100%;
  display: flex;
  .item {
    display: inline-block;
    text-align: center;
    flex: 1;
    line-height: 44px;
    width: 100%;
    color rgba(255, 255, 255, 0.5)
    &.router-link-active > span {
      color $color-theme
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>

<script>
export default {};
</script>