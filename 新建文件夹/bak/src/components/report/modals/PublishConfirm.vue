<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>发布报表模板</h3>
      <p>其他人将看到您发布的报表，是否确定发布本报表？ </p>
    </div>

    <div class="vuedal__actions flex-center flex">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="handleConfirm">确定</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 import Loader from '../../common/Loader.vue'

 export default {
   components: {Loader},
   name: 'publish-confirm',
   props: {
     type: String,
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
