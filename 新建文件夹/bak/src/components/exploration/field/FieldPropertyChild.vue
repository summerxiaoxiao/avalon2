<template>
  <li class="flex" @dblclick="editable=true">
    <editable-label :editable="editable" class="property-text trimmed-text-with-ellipsis caption item-fill" :label="displayName" @change="handleRename" @cancel="handleRenameCancel" :maxLength="64"> </editable-label>
    <button type="button" class="btn-icon" @click.prevent="showMenu"><i class="iconfont yg-xiala"></i></button>
    <button type="button" class="btn-icon" @click.prevent="removeHandler(property.role, parentProperty.index, property.index)"><i class="iconfont yg-shanchu"></i></button>
  </li>
</template>
<script>
  import FieldPropertyBase from './FieldPropertyBase.vue'

  export default {
    name: 'field-property-child',
    'extends': FieldPropertyBase
  }
</script>
