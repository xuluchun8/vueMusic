<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img style="height:150px" @load="loadImage" class="needsclick" :src="item.picUrl" alt>
              </a>
            </div>
          </slider>
        </div>
        <div class="discList-wrapper">
          <h2 class="disList-title">热门歌单推荐</h2>
          <div class="disList-item" v-for="(item,index) in discList" :key="index">
            <img class="item-img" v-lazy="item.imgurl" alt>
            <div class="description">
              <span class="creator-name">{{item.creator.name}}</span>
              <span class="name">{{item.dissname}}</span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="loading-wrapper" v-show="!this.discList.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
export default {
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
      this._getDiscList();
  },
  methods: {
    _getDiscList() {
      getDiscList().then(res => {
        if (ERR_OK === res.code) {
          this.discList = res.data.list;
        }
      });
    },
    // 判断图片是否加载回来
    loadImage() {
      if (!this.checkLoadImage) {
        this.$refs.scroll.refresh();
        this.checkLoadImage = true;
      }
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    }
  },
  components: {
    slider: Slider,
    scroll: Scroll,
    loading: Loading
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;

  .loading-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top 50%;
  }

  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper{
      height 150px;
      overflow hidden;
    }
    .discList-wrapper {
      width: 100%;

      .disList-title {
        text-align: center;
        height: 65px;
        line-height: 65px;
        font-size: $font-size-medium;
      }

      .disList-item {
        width: 100%;
        padding: 0 20px 20px 20px;
        display: flex;
        flex: 1;

        .item-img {
          width: 50px;
          height: 50px;
        }

        .description {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding-left: 15px;

          .creator-name {
            color: $color-text;
            font-size: $font-size-medium;
          }

          .name {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }
  }
}
</style>
