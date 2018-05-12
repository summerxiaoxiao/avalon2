<template>
  <div class="vuedal__content">
    <div class="vuedal__message">
      <h3>导出数据 </h3>
      <p>该报表数据将导出为EXCEL文件（.XLSX格式）</p>
    </div>

    <div class="vuedal__actions">
      <button type="button" class="btn btn-primary" @click.prevent="onConfirm">导出</button>
      <button type="button" class="btn btn-outline-black" @click.event="$emit('vuedals:close')">取消</button>
    </div>
  </div>
</template>
<script>
 export default {
   name: 'export-confirm',
   props: {
     onConfirm: Function,
     onNotSave: Function
   }
 }
</script>
