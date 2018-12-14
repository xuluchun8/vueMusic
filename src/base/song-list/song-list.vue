<template>
  <ul class="song_list">
    <li class="song_item" v-for="(song,index) in songs" :key="index">
      <span class="song_name">{{song.name}}</span>
      <span class="song_info" v-text="songInfo(song)"></span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods:{
    songInfo(song){
      return `${song.singer}.${song.album}`
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
.song_list {
  width: 100%;
  padding: 10px 30px;

  .song_item {
    font-size $font-size-medium
    height: 50px;
    padding: 7px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .song_name {
      color : $color-text;
    }

    .song_info {
      color : $color-text-d;
    }
  }
}

</style>
