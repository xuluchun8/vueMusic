<template>
  <div class="listview">
    <scroll
      :probeType="probeType"
      :listenScroll="listenScroll"
      :data="data"
      @scroll="onlistenScroll"
      class="singer-wrapper"
      ref="listview"
    >
      <ul class="singer_group_list">
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
      <div ref="fixedTitle" class="fixed" v-show="fixedTitle">{{fixedTitle}}</div>
      <div class="shortcut_wrapper">
        <ul>
          <li
            class="shortcut"
            @touchmove="onShortcutTouchMove"
            @touchstart="onShortcutTouchStart"
            :class="{'current': currentIndex === index}"
            :data-index="index"
            :key="index"
            v-for="(item,index) in shortcutList"
          >{{item}}</li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import { setTimeout } from "timers";
const ANCHOR_HEIGTH = 18;
const TITLE_HEIGHT = 30;
export default {
  name: "listview",
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: ""
    };
  },
  components: {
    Scroll
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      if (this.data[this.currentIndex]) {
        return this.data[this.currentIndex].title;
      }
      return "";
    }
  },
  created() {
    // touch无需放在data 或者 props中
    this.touch = {};
    this.listenScroll = true;
    this.probeType = 3;
    this.listHeight = [];
  },
  watch: {
    // 只有监听到数据的变话才知道height更新了
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    diff(val) {
      let fixedTop = val > 0 && val < TITLE_HEIGHT ? TITLE_HEIGHT - val : 0;
      // if(val < 30){
      //   console.log(val)
      this.$refs.fixedTitle.style.transform = `translate3d(0,${-fixedTop}px,0)`;
      // }
    },
    scrollY(newY) {
      let currentHeight = newY;
      if (currentHeight > 0) {
        this.currentIndex = 0;
        return;
      }
      let listHeight = this.listHeight;
      for (let i = 0; i < listHeight.length; i++) {
        let heightTop = listHeight[i];
        let heigthBottom = listHeight[i + 1];
        if (currentHeight > -heigthBottom && currentHeight <= -heightTop) {
          this.currentIndex = i;
          this.diff = newY + listHeight[i + 1];
          return;
        }
      }

      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    }
  },
  methods: {
    onlistenScroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutTouchStart(e) {
      let anchorIndex = e.target.dataset.index;
      this.currentIndex = parseInt(anchorIndex);
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGTH) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        // 不满足条件就return 可以节约性能
        return;
      }
      if (index < 0) {
        index = 0;
      }
      if(index > this.listHeight.length - 2){
        index = this.listHeight.length - 2
      }
      this.currentIndex = index;
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      let listHeight = [];
      listHeight[0] = 0;
      let height = 0;
      const list = this.$refs.listGroup;
      for (let i = 0; i < list.length; i++) {
        let itemHeight = list[i].clientHeight;
        height += itemHeight;
        listHeight.push(height);
      }
      this.listHeight = listHeight;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
}

.singer-wrapper {
  position: fixed;
  top: 88px;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}

.shortcut_wrapper {
  background-color: $color-background-d;
  position: absolute;
  padding: 20px 0;
  border-radius: 20px;
  right: 0;
  top: 20px;
  text-align: center;

  .shortcut {
    padding: 3px;
    font-size: 8px;
    color: $color-text-l;
  }

  .current {
    color: $color-theme;
  }
}

.fixed {
  position: absolute;
  top: 0px;
  background-color: $color-highlight-background;
  font-size: $font-size-small;
  height: 30px;
  width: 100%;
  line-height: 30px;
  padding-left: 15px;
  color: $color-text-l;
}

.singer_group_list {
  width: 100%;
  overflow: hidden;

  .singer_group {
    .singer_group_title {
      background-color: $color-highlight-background;
      font-size: $font-size-small;
      height: 30px;
      line-height: 30px;
      padding-left: 15px;
      color: $color-text-l;
    }

    .singer_list {
      &:last-child {
        padding-bottom: 20px;
      }

      .singer {
        padding: 20px 0 0 10px;
        display: flex;
        align-items: center;

        .singer_img_wrapper {
          padding: 0 20px;

          .singer_img {
            border-radius: 50%;
          }
        }

        .singer_name {
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
  }
}
</style>
