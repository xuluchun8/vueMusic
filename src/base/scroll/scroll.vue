<template>
  <div ref="wrapper" class="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscroll from "better-scroll";
export default {
  props: {
    data: {
      type: Array,
      default: null
    },
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new Bscroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo(){
      this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement(){
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>