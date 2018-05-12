<template>
  <div class="landing-container">
    <report-app-bar></report-app-bar>
    <report-list ref="list" :parentId="parentId"></report-list>
  </div><!-- /.landing-container -->
</template>

<script>
  import ReportAppBar from '../../components/report/AppBar.vue'
  import ReportList from '../../components/report/List.vue'

  export default {
    components: {
      ReportAppBar,
      ReportList
    },
    props: {
      parentId: String
    }
  }
</script>
