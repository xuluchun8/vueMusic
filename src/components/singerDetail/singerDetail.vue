<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  created() {
    let data = this.$store.state.singer
    console.log(data);
    mapGetters(["singer"])
  },
  computed: {
    ...mapGetters(["singer"])
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
