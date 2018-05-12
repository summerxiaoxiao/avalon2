<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>操作超时</h3>
      <p>翻页等待时间超出1分钟，确认后将返回首页</p>
    </div>

    <div class="vuedal__actions">
      <button type="button" class="btn btn-primary" @click.prevent="onConfirm">确定</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'data-timeout-confirm',
   props: {
     onConfirm: Function
   }
 }
</script>
