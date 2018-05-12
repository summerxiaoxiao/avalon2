<template>
  <li>
    <div class="field-well-property">
      <div class="flex" @dblclick="editable=true">
        <editable-label :editable="editable" class="property-text trimmed-text-with-ellipsis caption item-fill" :label="displayName" @change="handleRename" @cancel="handleRenameCancel" :maxLength="64"> </editable-label>
        <button type="button" class="btn-icon" @click.prevent="showMenu"><i class="iconfont yg-xiala"></i></button>
        <button type="button" class="btn-icon" @click.prevent="removeHandler(property.role, property.index )"><i class="iconfont yg-shanchu"></i></button>
      </div>
      <ol class="hierarchy-list" v-if="property.children && property.children.length">
        <field-property-child v-for="childProperty in property.children" :property="childProperty" :key="childProperty.id" :parentProperty="property" :renameHandler="renameHandler" :removeHandler="removeHandler" :actionHandler="actionHandler"></field-property-child>
      </ol>
    </div>
  </li>
</template>

<script>
  import Drop from '../../mixins/drop'
  import Drag from '../../mixins/drag'

  import FieldPropertyChild from './FieldPropertyChild.vue'
  import FieldPropertyBase from './FieldPropertyBase.vue'

  export default {
    name: 'field-property',
    'extends': FieldPropertyBase,
    components: {
      FieldPropertyChild
    },
    mixins: [
      Drop,
      Drag
    ]
  }
</script>
