<template>
  <div class="color-picker">
    <div class="color-picker__anchor" @click="showDropdown=true" ref="anchor">
      <div :style="{background: model}" class="color-picker__color-box color-picker__color-tile color-picker__color-box--selected">
      </div>
      <span class="color-picker__icon"><i class="iconfont yg-xiala"></i></span>
    </div>
    <dropdown :reference="$refs.anchor" v-if="showDropdown" @close="closeDropdown" class="color-picker__dropdown">
      <color-picker-popup class="color-picker__popup-container" :value="model" @input="handleChange" :defaultValue="defaultValue"></color-picker-popup>
    </dropdown>
  </div>
</template>

<script>
  import Dropdown from '../Dropdown.vue'
  import ColorPickerPopup from './Popup.vue'

  export default {
    components: {
      ColorPickerPopup,
      Dropdown
    },
    name: 'color-picker',
    props: {
      value: String,
      defaultValue: String
    },
    data () {
      return {
        model: this.value,
        showDropdown: false
      }
    },
    watch: {
      value (value) {
        this.model = value
      }
    },
    methods: {
      handleChange (color) {
        this.model = color
        this.$emit('input', color)
        this.showDropdown = false
      },
      closeDropdown () {
        this.model = this.value
        this.showDropdown = false
      }
    }
  }
</script>
