<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>数据量过大，请求会很耗时</h3>
      <p>确定还要继续请求吗？</p>
    </div>

    <div class="vuedal__actions">
      <button type="button" class="btn btn-primary" @click.prevent="onConfirm">确定</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'data-big-confirm',
   props: {
     onConfirm: Function
   }
 }
</script>
