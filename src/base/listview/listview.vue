<template>
  <div class="listview">
    <scroll :data="data" class="singer-wrapper" ref="listview">
      <ul class="singer_group_list" >
        <li class="singer_group" ref="listGroup" v-for="(group,index) in data" :key="index">
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
      <div class="shortcut_wrapper">
        <ul>
          <li class="shortcut"  v-for="(item,index) in shortcutList"
          @touchmove="onShortcutTouchMove" @touchstart="onShortcutTouchStart" :class="{'active' : index === currentIndex }"  :data-index="index" :key="index">
            {{item}}
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll';
const ANCHOR_HEIGTH = 18
export default {
  name:'listview',
  data(){
    return {
      currentIndex : ''
    }
  },
  props: {
    data:{
      type: Array,
      default: []
    }
  },
  components:{
    Scroll
  },
  computed: {
    shortcutList(){
      return this.data.map((item) => {
        return item.title.substr(0,1)
      })
    },
  },
  created() {
    // touch无需放在data 或者 props中
    this.touch = {}
  },
  methods: {
    onShortcutTouchStart(e){
      if(this.touch.firstTouch){
        this.touch = {
          firstTouch : this.touch.firstTouch
        }
      }
      let anchorIndex = e.target.dataset.index
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e){
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGTH | 0
      console.log(delta,anchorIndex)
      let anchorIndex = this.touch.anchorIndex | 0 + delta
      this.currentIndex = anchorIndex 
      // console.log(this.currentIndex);
      
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
      }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer-wrapper{
  position fixed
  top 88px
  right 0
  left 0
  bottom 0
  overflow hidden
}
.shortcut_wrapper
  background-color $color-background-d
  position absolute
  padding 20px 0
  border-radius 20px
  right 0
  top 20px
  text-align center
  .shortcut
    padding 3px
    font-size 8px
    color $color-text-l
  .active
    color $color-theme
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
      &:last-child
        padding-bottom 20px
      .singer
        padding 20px 0 0 10px
        display flex
        align-items center
 
        .singer_img_wrapper
          padding 0 20px
          .singer_img
            border-radius 50%
        .singer_name
          color $color-text-l
          font-size $font-size-medium
</style>
