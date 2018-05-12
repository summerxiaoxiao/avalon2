
<template>
  <div class="landing-container">
    <dataset-app-bar></dataset-app-bar>
    <dataset-list ref="list" :parentId="parentId"></dataset-list>
  </div><!-- /.landing-container -->
</template>

<script>
  import DatasetAppBar from '../components/dataset/AppBar.vue'
  import DatasetList from '../components/dataset/List.vue'

  export default {
    components: {
      DatasetAppBar,
      DatasetList
    },
    props: {
      parentId: String
    }
  }
</script>

