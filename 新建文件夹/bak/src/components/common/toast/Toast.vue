<template>
  <div class="toast-container unselectable">
    <notification @close="handleClose" v-bind="notification" v-for="notification in notifications" :key="notification.id"></notification>
  </div>
</template>
<script>
  import Notification from './Notification.vue'

  export default {
    components: {Notification},
    name: 'toast',
    props: {
      notifications: Array
    },
    methods: {
      handleClose (id) {
        this.$emit('close', id)
      }
    }
  }
</script>
