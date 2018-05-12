<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>删除此{{ type === '0' ? '目录' : '报表'}}</h3>
      <p>是否确定删除此{{ type === '0' ? '目录' : '报表'}}？
        <template v-if="type === '0'">
          <br />确认后将删除此目录及此目录下所有的报表
        </template>
      </p>
    </div>

    <div class="vuedal__actions flex-center flex">
      <loader v-if="saving" style="display: inline-block"></loader>
      <button :disabled="saving" type="button" class="btn btn-black" @click.prevent="handleConfirm">删除</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 import Loader from '../../common/Loader.vue'

 export default {
   components: {Loader},
   name: 'delete-confirm',
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
