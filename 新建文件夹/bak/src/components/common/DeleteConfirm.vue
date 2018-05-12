<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>{{title}}</h3>
      <p v-html="message"></p>
    </div>

    <div class="vuedal__actions flex-center flex">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="handleConfirm">删除</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 import Loader from './Loader.vue'

 export default {
   components: {Loader},
   name: 'delete-confirm',
   props: {
     title: String,
     message: String,
     onConfirm: Function
   },
   data () {
     return {
       saving: false
     }
   },
   methods: {
     handleConfirm () {
       this.saving = true
       this.onConfirm().then(() => {
         this.saving = false
         this.$emit('vuedals:close')
       }, () => {
         this.saving = false
       })
     }
   }
 }
</script>
