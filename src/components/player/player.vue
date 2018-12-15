<template>
  <div class="player" v-show="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @leave="leave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" class="bg-image" :src="currentSong.image" alt>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer">sdfsd</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdcls">
                <img :src="currentSong.image" width="100%" height="100%" class="image" alt>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div @click="pre" class="icon i-left" :class="disablecls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying" :class="disablecls">
              <i :class="playing ? 'icon-play' : 'icon-pause'"></i>
            </div>
            <div @click="next" class="icon i-right" :class="disablecls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="min-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img
            :class="cdcls"
            class="icon-image"
            :src="currentSong.image"
            width="40"
            height="40"
            alt
          >
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div @click.stop="togglePlaying" class="control">
          <i :class="playing ? 'icon-play-mini' : 'icon-pause-mini'"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" @canplay="ready" @error="error" :src="currentSong.url"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";

const transform = prefixStyle("transform");
export default {
  data() {
    return {
      songReady: false
    };
  },
  watch: {
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    },
    currentSong() {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        console.log("song");
        // this.togglePlaying()
        audio.play();
      });
    }
  },

  methods: {
    pre() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length - 1) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    back() {
      this.setFullscreen(false);
    },
    open() {
      this.setFullscreen(true);
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
    },
    ...mapMutations({
      setFullscreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    }),
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      }),
        animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const paddingLeft = 40;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingBottom - width / 2 - paddingTop;
      return {
        x,
        y,
        scale
      };
    }
  },
  computed: {
    disablecls() {
      return this.songReady ? "" : "disable";
    },
    cdcls() {
      return this.playing ? "play" : "play pause";
    },
    ...mapGetters([
      "fullScreen",
      "currentIndex",
      "playlist",
      "playing",
      "currentSong"
    ])
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.player {
  .background {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: $color-background;

    .bg-image {
      filter: blur(20px);
      z-index: 44;
      opacity: 0.5;
    }
  }

  .min-player {
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    width: 100%;
    display: flex;
    // z-index 444
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    background-color: $color-highlight-background;

    .icon {
      border-radius: 50%;
      padding-left: 20px;

      .icon-image {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      width: 50%;

      .name {
        color: $color-text;
        height: 20px;
        line-height: 20px;
        font-size: $font-size-medium;
      }

      .desc {
        height: 20px;
        line-height: 20px;
        color: $color-text-d;
        font-size: $font-size-small;
      }
    }

    .control {
      position: relative;
      right: 10px;
      width: 32px;
      height: 32px;

      .icon-play-mini, .icon-pause-mini {
        font-size: 32px;
      }

      .icon-playlist {
        font-size: 32px;
      }
    }
  }

  .normal-player {
    position: fixed;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 150;
    background-color: #333;

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        padding: 10px;
        position: absolute;
        font-size: $font-size-large-x;
        transform: rotate(-90deg);
      }

      .title {
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
        height: 40px;
        line-height: 40px;
      }

      .subtitle {
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-text;
        height: 20px;
        line-height: 20px;
      }
    }

    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;

      .middle-l {
        position: absolute;
        width: 80%;
        height: 100%;
        left: 10%;

        .cd-wrapper {
          border: solid gray 10px;
          box-sizing: border-box;
          border-radius: 50%;
          width: 100%;
          height: 80%;

          // display inline-block
          .cd {
            border-radius: 50%;
            width: 100%;
            height: 100%;
            overflow: hidden;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .operators {
        padding: 0 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .disable {
          color: gray;
        }

        .icon {
          font-size: 30px;
        }

        .i-center {
          font-size: 40px;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
