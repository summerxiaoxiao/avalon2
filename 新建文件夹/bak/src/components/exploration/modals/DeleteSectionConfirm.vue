<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>删除此工作表</h3>
      <p>是否确定删除此工作表？<br />如果保存报表，该工作表及其中的图表将被永久删除。</p>
    </div>

    <div class="vuedal__actions">
      <button type="button" class="btn btn-black" @click.prevent="onConfirm">删除</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'delete-section-confirm',
   props: {
     onConfirm: Function
   }
 }
</script>
