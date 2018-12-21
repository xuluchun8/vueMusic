<template>
  <div class="muscic_list_wrapper">
    <div class="back" @click="backToSinger">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="singer_bg" :style="bgStyle" ref="singerBg">
      <div class="pup"></div>
      <div class="playBtn-wrapper" @click="startRandomPlay" v-show="hidePlayBtn && songs.length">
        <div class="playBtn" ref="playBtn">
          <i class="icon-play"></i>
          <span class="play_text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg_layer" ref="bgLayer"></div>

    <scroll
      @scroll="scroll"
      :probeType="probeType"
      :listenScroll="listenScroll"
      :data="songs"
      ref="list"
    >
      <div class="song_list_wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { prefixStyle } from "common/js/dom";
import { mapActions, mapGetters } from "vuex";
import playlistMixin from 'common/js/mixin'

const transform = prefixStyle("transform");
const LAYER_MIN_TOP = 40;
export default {
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  data() {
    return {
      // scrollY : ''
      hidePlayBtn: true,
      scale: 0
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  mixins:[playlistMixin], 
  mounted() {
    this.imageHeight = this.$refs.singerBg.clientHeight;
    // 对scroll组件的根dom元素进行操作
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    this.$refs.bgLayer.style.top = `${this.imageHeight}px`;
  },
  computed: {
    bgStyle() {
      return `backgroundImage:url('${this.avatar}')`;
    },
    singerBgHeigth() {
      if (this.$refs.singerBg) {
        return `top:${this.$refs.singerBg.clientHeight}px`;
      }
    }
  },
  methods: {
    handlePlaylist(playlist){
       const bottom = playlist.length > 0 ? '60px' : ''
       this.$refs.list.$el.style.bottom = bottom
       this.$refs.list.refresh()
    },
    startRandomPlay(){
      console.log(this.randomPlay);
      this.$store.dispatch('randomPlay',{songs :this.songs})
      //  this.randomPlay({
      //    songs:this.songs
      //  })
    },
    scroll(pos) {
      let layerTop =
        this.imageHeight + pos.y > LAYER_MIN_TOP
          ? this.imageHeight + pos.y
          : LAYER_MIN_TOP;
      if (layerTop <= LAYER_MIN_TOP) {
        this.$refs.singerBg.style.height = "40px";
        this.$refs.singerBg.style.zIndex = 10;
        this.hidePlayBtn = false;
      } else {
        this.$refs.singerBg.style.height = `${this.imageHeight}px`;
        this.$refs.singerBg.style.zIndex = 0;
        this.hidePlayBtn = true;
      }
      // 变化bg-img的大小
      if (pos.y > 0) {
        let scale = 1 + pos.y / 200;
        this.$refs.singerBg.style[transform] = `scale(${scale})`;
        this.$refs.singerBg.style.height = `${this.imageHeight + pos.y}px`;
      }
      // layer层top值
      this.$refs.bgLayer.style.top = `${layerTop}px`;
      this.$refs.bgLayer.style[transform] = `translate3d(0,${pos.y},0)`;
    },
    backToSinger() {
      this.$router.push("/singer");
    },
    selectItem(item, index) {

      this.selectPlay({
        list: this.songs,
        index
      });
    },
    ...mapActions(["selectPlay"],['randomPlay'])
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.back {
  padding: 15px;
  position: relative;
  z-index: 99 !important;

  .icon-back {
    font-size: $font-size-large-x;
  }
}

.title {
  position: relative;
  z-index: 99 !important;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  color: $color-text;
  position: relative;
  top: -40px;
  font-size: $font-size-large;
}

.bg_layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #222;
  overflow: hidden;
  z-index: 0;
}

.loading-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
}

.singer_bg {
  width: 100%;
  height: 224px;
  position: absolute;
  top: 0;
  z-index: -1;

  .playBtn-wrapper {
    width: 100%;
    position: absolute;
    top: 140px;
    text-align: center;

    .playBtn {
      transform: translateX(-50%);
      left: 50%;
      position: absolute;
      padding: 5px 20px;
      border: solid $color-theme 1px;
      border-radius: 20px;
      z-index: 0;

      .icon-play {
        vertical-align: middle;
      }

      .play_text {
        font-size: $font-size-small;
      }
    }
  }

  .pup {
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: #222;
    opacity: 0.5;
  }
}
</style>
