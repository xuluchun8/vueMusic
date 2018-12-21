<template>
  <div class="progress-bar">
    <p class="time">{{playingTime}}</p>
    <div
      class="progress-wrapper"
      @touchstart.prevent="progressTouchstart"
      @touchmove="progressTouchmove"
      @touchend="progressTouchend"
    >
      <div class="progress">
        <div class="active-progress" ref="activeBar"></div>
      </div>
      <div class="dot" ref="activeDot"></div>
    </div>
    <p class="time">{{durationTime}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playingTime: "00:00"
      // playPercent : 0
    };
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  computed: {
    durationTime() {
      return this._formatTime(this.duration);
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchstart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.activeBar.clientWidth;
      this.touch.offsetLeft = e.currentTarget.offsetLeft;
      this._moveProgress(this.touch)
    },
    progressTouchmove(e) {
      this.touch.startX = e.touches[0].pageX;
      this._moveProgress(this.touch)
    },
    progressTouchend(e) {
      if(!this.touch.startX){
        this.touch.startX = e.touches[0].pageX;
      }
      this._moveProgress(this.touch)
      this.touch.initiated = false;
    },
    // 拖动滚动条
    _moveProgress(thisTouch) {
      if (
        thisTouch.startX - thisTouch.offsetLeft > 8 &&
        thisTouch.startX - thisTouch.offsetLeft - 8 < thisTouch.left
      ) {
        this.$refs.activeDot.style.left =
          thisTouch.startX - thisTouch.offsetLeft - 8 + "px";
        this.$refs.activeBar.style.left =
          thisTouch.startX - thisTouch.offsetLeft - thisTouch.left - 8 + "px";
      }
      let playingTime = this.duration*(thisTouch.startX - thisTouch.offsetLeft  - 8) / thisTouch.left
      playingTime = playingTime < 0 ? 0 : playingTime
      playingTime = playingTime > this.duration ? this.duration : playingTime
      this.$emit('getPlayingTime',playingTime)
    },
    _formatTime(time) {
      let s = time % 60;
      let m = (time - s) / 60;
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return `${m}:${s}`;
    }
  },
  watch: {
    currentTime(newVal) {
      // if(!this.touch.initiated){
        this.playingTime = this._formatTime(newVal);
        let per = newVal / this.duration;
        this.$refs.activeBar.style.left = `${-100 + per * 100}%`;
        this.$refs.activeDot.style.left = `${per * 100}%`;
      // }

    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-bar {
  width: 80%;
  display: flex;
  align-items: center;
  height: 50px;

  .progress-wrapper {
    flex-grow: 1;
    height: 4px;
    width: 100%;
    // position: relative;
    overflow: hidden;
    padding: 8px;

    .progress {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background-color: $color-background-d;
    }

    .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: solid white 3px;
      position: relative;
      top: -9px;
      box-sizing: border-box;
      background-color: $color-theme;
      transform: translateX(-8px);
    }

    .active-progress {
      position: absolute;
      left: -100%;
      height: 4px;
      background-color: $color-theme;
      width: 100%;
    }
  }

  .time {
    width: 50px;
    display: block;
    font-size: 12px;
    padding: 0 5px;
    color: white;
  }
}
</style>
