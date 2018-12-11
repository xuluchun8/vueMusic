<template>
  <div id="m-header">
    <img src="./logo@2x.png" alt="" class="icon">
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable.styl';
#m-header
  text-align center
  .icon
    vertical-align middle
    width 32px
    margin-right 9px
  .text
    display inline-block
    vertical-align middle
    line-height: 44px
    font-size $font-size-large

</style>

<script>
  export default{
    
  }
</script>