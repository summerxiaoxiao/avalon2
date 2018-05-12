<template>
<div>
  <div class="color-picker__flyout" v-if="!custom">
    <!--
    <div class="color-picker__color-section__button">
      <span class="color-picker__color-section__morecolors-title" @click="restoreDefault">还原默认</span>
    </div>
    -->
    <div class="color-picker__color-section__title">选取颜色</div>
    <div class="color-picker__color-theme" v-for="theme in themes">
      <color-tile class="color-picker__parent-color" :color="theme.parentColor" @click.native="colorSelected(theme.parentColor)"></color-tile>

      <color-tile class="color-picker_child-color" v-for="childColor, index in theme.children" :color="childColor" @click.native="colorSelected(childColor)" :key="index"></color-tile>
    </div>
    <div class="color-picker__color-section__title">最近选取的颜色</div>
    <div class="color-picker__recent-colors-container">
      <color-tile class="color-picker__recent-color" :class="{'color-picker__color-box--selected' : recentColor === model}" v-for="recentColor, index in recentColors" :color="recentColor" @click.native="colorSelected(recentColor)" :key="index"></color-tile><div class="color-picker__color-tile color-picker__recent-color color-picker__color-placeholder" v-for="i in (10 - recentColors.length)"></div>
    </div>
    <div class="color-picker__color-section__button">
      <span class="color-picker__color-section__morecolors-title" @click="custom = true">自定义颜色</span>
    </div>
  </div>
  <color-wheel v-if="custom" v-model="model" @confirm="colorSelected"></color-wheel>
</div>
</template>
<script>
  import ColorWheel from './ColorWheel.vue'
  import ColorTile from './ColorTile.vue'
  import { themes, getRecentColors, addRecentColors } from '../../../common/colorFont'

  export default {
    name: 'color-picker-popup',
    components: {ColorWheel, ColorTile},
    props: {
      value: String,
      defaultValue: String
    },
    data () {
      return {
        custom: false,
        model: this.value,
        themes: themes,
        recentColors: getRecentColors()
      }
    },
    watch: {
      value (value) {
        this.color = value
      }
    },
    methods: {
      colorSelected (color) {
        this.model = color
        this.recentColors = addRecentColors(color)
        this.$emit('input', color)
      },
      restoreDefault () {
        this.colorSelected(this.defaultValue)
      }
    }
  }
</script>
