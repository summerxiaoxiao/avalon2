<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>更改尚未保存</h3>
      <p>要保存对此报表所做的更改吗？</p>
    </div>

    <div class="vuedal__actions">
      <button type="button" class="btn btn-primary" @click.prevent="onSave">保存</button>
      <button type="button" class="btn btn-black" @click.prevent="onNotSave">不保存</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'save-confirm',
   props: {
     onSave: Function,
     onNotSave: Function
   }
 }
</script>
