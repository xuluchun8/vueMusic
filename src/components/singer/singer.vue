<template>
  <div class="singer">
    <listview @gotoSingerDetail="gotoSingerDetail" :data="normalizSingerList" ></listview>
    <router-view></router-view>
  </div>
  
</template>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer
  position fixed
  top 88px 
  bottom 0
  width 100%

</style>

<script>
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "common/js/singer.js";
import Listview from 'base/listview/listview'

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  components: {
    Listview
  },
  data() {
    return {
      singerList: [],
      normalizSingerList:[]
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    gotoSingerDetail(singer){
      this._setSinger(singer)
      this.$router.push({ path: `/singer/${singer.id}`})
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (ERR_OK === res.code) {
          this.singerList = res.data.list;
          this.normalizSingerList = this._normalizeSinger(this.singerList);
        }
      });
    },
    _setSinger(singer){
      this.$store.commit('SET_SINGER',singer)
    },
    // 标准化singer数据
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              mid: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            mid: item.Fsinger_mid
          })
        );
      });  
      // map排序
      let hot = []
      let ret = []
      for (const key in map) {
        if(map[key].title === HOT_NAME){
          hot.push(map[key])
        }
        if(map[key].title.match(/[a-zA-Z]/)){
          ret.push(map[key])
        }
      }      
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
};
</script>