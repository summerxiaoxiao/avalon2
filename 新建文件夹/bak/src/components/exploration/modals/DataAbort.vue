<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>数据量过大，请求中断</h3>
    </div>
    <div class="vuedal__actions">
      <button type="button" class="btn btn-primary" @click.prevent="$emit('vuedals:close')">确定</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'data-abort-confirm'
 }
</script>
