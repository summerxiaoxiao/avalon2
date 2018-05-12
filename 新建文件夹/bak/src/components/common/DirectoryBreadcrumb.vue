<template>
  <div class="breadcrumb">
    <template v-if="prevDir">
      <router-link :to="{name: pathName, params: {parentId: (prevDir.id === 'root' || prevDir.id === null) ? null : prevDir.id}}">返回上一级</router-link> <span> | </span>
    </template>
    <template v-for="dir, index in directories">
      <router-link v-if="index !== directories.length - 1" :to="{name: pathName, params: {parentId: (dir.id === 'root' || dir.id === null) ? null : dir.id}}">{{dir.name}}</router-link>
      <span v-else>{{ dir.name }} </span>
      <span v-if="index !== directories.length - 1"> &gt; </span>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'directory-breadcrumb',
    props: {
      directories: Array,
      pathName: {
        type: String,
        required: true
      }
    },
    computed: {
      prevDir () {
        const length = this.directories.length
        if (length < 2) {
          return
        }
        return this.directories[length - 2]
      }
    }
  }
</script>
