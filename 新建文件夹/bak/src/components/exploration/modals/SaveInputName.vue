<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <div>为你的报表输入名称</div>
      <input type="text" class="form-control save-name-input" placeholder="输入报表名称" v-model="model">
    </div>

    <div class="vuedal__actions flex-center">
      <button type="button" class="btn btn-primary" @click.prevent="handleSave">保存</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import {Message} from 'element-ui'
  export default {
    name: 'save-input-name',
    props: {
      onSave: Function
    },
    data () {
      return {
        model: ''
      }
    },
    methods: {
      handleSave () {
        const name = $.trim(this.model)
        if (name === '') {
          Message.error('名称不能为空')
          return
        }
        if (name.length > 64) {
          Message.error('名称长度不能为大于64个字符')
          return
        }
        this.onSave(this.model)
      }
    }
  }
</script>
