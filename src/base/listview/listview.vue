<template>
  <div class="listview">
    <scroll :data="data" class="singer-wrapper">
      <ul class="singer_group_list">
        <li class="singer_group" v-for="(group,index) in data" :key="index">
          <h2 class="singer_group_title">{{group.title}}</h2>
          <ul class="singer_list">
            <li class="singer" v-for="(item,index) in group.items" :key="index">
              <div class="singer_img_wrapper">
                <img class="singer_img" width="50px" height="50px" v-lazy="item.avatar">
              </div>
              <p class="singer_name">{{item.name}}</p>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll';
export default {
  name:'listview',
  props: {
    data:{
      type: Array,
      default: []
    }
  },
  components:{
    scroll : Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer-wrapper{
  position fixed
  top 88px
  bottom 0
  overflow hidden
}
.singer_group_list
  width 100%
  .singer_group
    .singer_group_title
      background-color $color-highlight-background
      font-size $font-size-small
      height 30px
      line-height 30px
      padding-left 15px
      color $color-text-l
    .singer_list
      .singer
        padding 20px 0 0 10px
        display flex
        align-items center
        // flex-direction 
        .singer_img_wrapper
          padding 0 20px
          .singer_img
            border-radius 50%
        .singer_name
          color $color-text-l
          font-size $font-size-medium
</style>
