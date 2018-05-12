<template>
  <div class="landing-container">
    <app-bar>
      <div class="app-bar__section app-bar__section--left" slot="left">
        <span class="app-bar__return">
          <a href="#" @click.prevent="handleReturn">&lt; 返回</a>
        </span>
      </div>
    </app-bar>
    <Linkage :id="id" :type="type"></Linkage>
  </div><!-- /.landing-container -->
</template>

<script>
  import AppBar from '../components/common/AppBar.vue'
  import Linkage from '../components/linkage/Linkage.vue'

  export default {
    components: {
      Linkage,
      AppBar
    },
    props: {
      id: [String, Number],
      type: String
    },
    beforeDestroy () {
      this.$store.commit('linkage/unset')
    },
    methods: {
      handleReturn () {
        this.$router.go(-1)
      }
    }
  }
</script>
