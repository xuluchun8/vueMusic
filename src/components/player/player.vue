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
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
          >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdcls">
                <img :src="currentSong.image" width="100%" height="100%" class="image" alt>
              </div>
            </div>
            <div class="currentLyrictext">{{currentLyrictext}}</div>
          </div>
         <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
          
        </div>
        <div class="bottom">
          <div class="dots">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <progress-bar
              @getPlayingTime="changePlayingTime"
              :duration="currentSong.duration"
              :currentTime="playingTime"
            ></progress-bar>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changMode">
              <i :class="modeIcon"></i>
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
          <progress-circle :perVal="perVal" :radius="32">
            <i :class="playing ? 'icon-play-mini' : 'icon-pause-mini'"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      @timeupdate="updateTime"
      ref="audio"
      @canplay="ready"
      @error="error"
      :src="currentSong.url"
      @ended="end"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import ProgressBar from "components/progress-bar/progress-bar";
import ProgressCircle from "components/progress-circle/progress-circle";
import { prefixStyle } from "common/js/dom";
import {createSong} from 'common/js/song'
import Scroll from "base/scroll/scroll"
import Lyric from 'lyric-parser'

const transform = prefixStyle("transform");
export default {
  data() {
    return {
      currentLyrictext:'',
      songReady: false,
      playingTime: 0,
      perVal: 0,
      currentLyric:null,
      currentLineNum:0,
      currentShow:'cd'
    };
  },
  watch: {
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    },
    currentSong(newVal,oldVal) {
      if(newVal.id === oldVal.id){
        return
      } 
      if(this.currentLyric){
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        audio.play();
        this._getLyric()
      });
    }
  },
  created() {
    this.touch = {}
  },
  methods: {

    touchstart(e){
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    touchmove(e){
      if (!this.touch.initiated) {
          return
      }
      const touch = e.touches[0]
      let deltaX = touch.pageX - this.touch.startX
      let deltaY = touch.pageY - this.touch.startY
      if(Math.abs(deltaX) < Math.abs(deltaY)){
        return
      }
     if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0
    },
    touchend(e){
       if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transitionDuration = `${time}ms`
        this.touch.initiated = false
    },
    _getLyric(){
      this.currentSong.getLyric().then(lyric => {
       this.currentLyric = new Lyric(lyric,this.handelLyric)
      }).catch(() => {
        this.currentLyric = null 
        this.playingLyric =''
        this.currentLineNum = 0
      })
    },
    handelLyric({lineNum, txt}){
      this.currentLineNum = lineNum
      this.currentLyrictext = txt
      if(lineNum > 5){
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl,1000)        
      }else{
        this.$refs.lyricList.scrollTo(0,0,1000)
      }
    },
    end(){
      if(this.mode == 1){
        this.loop()
      }else{
        this.next()
      }
    },
    loop(){
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if(this.currentLyric){
        this.currentLyric.seek(0)
      }
    },
    changMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayingMode(mode);
      if(mode == 0){
        this.playlist = this.$store.getters.sequenceList
      }
      if(mode == 2){
        this.playlist = this._radomPlaylist(this.playlist)
      }      
    },
    _radomPlaylist(playlist){
      // slice浅克隆
      let _playlist = playlist.slice()
      _playlist.sort(() => Math.random() - 0.5)
      let newIndex = _playlist.findIndex(item => {
        return item.id === playlist[this.currentIndex].id 
      })
      this.setCurrentIndex(newIndex)
      this.setPlaylist(_playlist)
      return _playlist 
    },
    changePlayingTime(currentTime) {
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if(this.currentLyric){
        this.currentLyric.seek(currentTime*1000)
      }
    },
    updateTime(e) {
      this.playingTime = e.target.currentTime | 0;
      this.perVal = this.playingTime / this.duration;
    },

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
      if(this.currentLyric){
        this.currentLyric.togglePlay()
      }
      this.setPlayingState(!this.playing);
    },
    ...mapMutations({
      setFullscreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingMode: "SET_PLAY_MODE",
      setPlaylist:'SET_PLAYLIST'
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
    modeIcon() {
      return this.mode == 0
        ? "icon-sequence"
        : this.mode == 1
        ? "icon-loop"
        : "icon-random";
    },
    duration() {
      return this.currentSong.duration;
    },
    disablecls() {
      return this.songReady ? "" : "disable";
    },
    cdcls() {
      return this.playing ? "play" : "play pause";
    },
     playlist :{
      set(){
        // return this.$store.getters.playlist
      },
      get(){
        return this.$store.getters.playlist
      }
    },
    ...mapGetters([
      "fullScreen",
      "currentIndex",
      // "playlist",
      "playing",
      "currentSong",
      "mode"
    ])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.player 
  .background 
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: $color-background;

    .bg-image 
      filter: blur(20px);
      z-index: 44;
      opacity: 0.5;


  .min-player 
    &.mini-enter-active, &.mini-leave-active 
      transition: all 0.4s;


    &.mini-enter, &.mini-leave-to 
      opacity: 0;


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

    .icon 
      border-radius: 50%;
      padding-left: 20px;

      .icon-image 
        border-radius: 50%;

        &.play 
          animation: rotate 10s linear infinite;
    

        &.pause 
          animation-play-state: paused;
    
  


    .text 
      width: 50%;

      .name 
        color: $color-text;
        height: 20px;
        line-height: 20px;
        font-size: $font-size-medium;
  

      .desc 
        height: 20px;
        line-height: 20px;
        color: $color-text-d;
        font-size: $font-size-small;
  


    .control 
      position: relative;
      right: 10px;
      width: 32px;
      height: 32px;

      .icon-play-mini, .icon-pause-mini 
        font-size: 32px;
        position: absolute;
        opacity: 0.5;
        top: 0;
  

      .icon-playlist 
        font-size: 32px;
        opacity: 0.5;
  


  .normal-player 
    position: fixed;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 150;
    background-color: #333;

    .top 
      position: relative;
      margin-bottom: 25px;

      .back 
        padding: 10px;
        position: absolute;
        font-size: $font-size-large-x;
        transform: rotate(-90deg);
  

      .title 
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
        height: 40px;
        line-height: 40px;
  

      .subtitle 
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-text;
        height: 20px;
        line-height: 20px;
    .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .currentLyrictext
            width:100%
            text-align:center
            font-size:14px
            margin:30px 0
            color:rgba(255,255,255,0.5)
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text

    .bottom 
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dots
        text-align center
        width 100%
        .dot
          display:inline-block
          width 10px
          height 10px
          border-radius 50%
          background-color gray 
        .active 
          background-color white
          width 20px
          height 10px
          border-radius 5px
      .progress-wrapper 
        width: 100%;
        padding: 0 10%;
        height: 50px;
  

      .operators 
        padding: 0 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .disable 
          color: gray;
    

        .icon 
          font-size: 30px;
    

        .i-center 
          font-size: 40px;
    
  


    &.normal-enter-active, &.normal-leave-active 
      transition: all 0.4s;

      .top, .bottom 
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  


    &.normal-enter, &.normal-leave-to 
      opacity: 0;

      .top 
        transform: translate3d(0, -100px, 0);
  

      .bottom 
        transform: translate3d(0, 100px, 0);
  


@keyframes rotate 
  0% 
    transform: rotate(0);

  100% 
    transform: rotate(360deg);
</style>
