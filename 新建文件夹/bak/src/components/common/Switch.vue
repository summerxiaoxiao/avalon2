<template>
  <div
    class="el-switch"
    :class="{ 'is-disabled': disabled, 'is-checked': checked }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled"
    @click="switchValue"
  >
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="disabled"
      @keydown.enter="switchValue"
    >
    <span
      :class="['el-switch__label', 'el-switch__label--left', checked ? 'is-active' : '']"
      v-if="activeIconClass || activeText">
      <i :class="[activeIconClass]" v-if="activeIconClass"></i>
      <span v-if="!activeIconClass && activeText" :aria-hidden="checked">{{ checked ? activeText : inactiveText }}</span>
    </span>
    <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      <span class="el-switch__button" :style="{ transform }"></span>
    </span>
  </div>
</template>
<script>
  import {Switch} from 'element-ui'
  export default {
    name: 'Switch',
    'extends': Switch,
    props: {
      holdClick: {
        type: Boolean,
        'default': true
      },
      'active-text': {
        type: String,
        'default': ''
      },
      'inactive-text': {
        type: String,
        'default': ''
      }
    },
    methods: {
      switchValue () {
        if (this.holdClick) {
          this.$refs.input.click()
        }
      }
    }
  }
</script>
