<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version='1.1' >
      <circle   class="progress-background" r="50" cx="50" cy="50" fill="transparent" ></circle>
      <circle   :stroke-dasharray="dasharray" 
              :stroke-dashoffset="dashoffset"
              r="50" cx="50" cy="50" fill="transparent" class="progress-bar" ></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        dasharray : Math.PI*2*50
      }
    },
    props:{
      radius:{
        type: Number
      },
      perVal:{
        type:Number,
        default:0
      }
    },
    computed:{
      dashoffset(){
        return(1-this.perVal)*this.dasharray 
      }
    },
  }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable";
.progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
        
</style>
