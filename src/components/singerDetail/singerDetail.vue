<template>
  <transition name="slide">
    <music-list class="singer-detail" :songs="songs" :title="singer.name" :avatar="singer.avatar"></music-list>
  </transition>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getSingerDetail } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import createSong from "common/js/song";
import MusicList from "components/music-list/music-list";
export default {
  created() {
    this._getSingerDetail();
    mapGetters(["singer"]);
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getSingerDetail() {
      let id = this.singer.id;
      // 如果没有获取到id则跳转到singer页面
      if (!id) {
        this.$router.push({ path: "/singer" });
        return;
      }
      getSingerDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSingerDetail(res.data.list);
        }
      });
    },
    _normalizeSingerDetail(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  computed: {
    ...mapGetters(["singer"])
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
