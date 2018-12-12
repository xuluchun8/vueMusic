<template>
  <div class="loading">
    <img class="loading-img" src="./loading.gif" alt="">
    <p class="loading-text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type : String,
        default: '正在加载...'
      }
    },
  }
</script>

<style lang="stylus">
@import '~common/stylus/variable'
  .loading
    position absolute
    text-align center
    .loading-img
      width 30px
      height 30px
    .loading-text
      color $color-text
      font-size $font-size-small
      padding-top 10px
</style>
