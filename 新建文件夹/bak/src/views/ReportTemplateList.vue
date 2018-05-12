<template>
  <div class="landing-container">
    <report-app-bar></report-app-bar>
    <report-list ref="list" :parentId="parentId"></report-list>
  </div><!-- /.landing-container -->
</template>

<script>
  import ReportAppBar from '../components/reportTemplate/AppBar.vue'
  import ReportList from '../components/reportTemplate/List.vue'

  export default {
    components: {
      'report-app-bar': ReportAppBar,
      'report-list': ReportList
    },
    props: {
      parentId: String
    }
  }
</script>
