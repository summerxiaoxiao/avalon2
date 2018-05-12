<script>
  import $ from 'jquery'
  import 'jquery.scrollbar'

  export default {
    name: 'scrollbar',
    mixins: [],

    props: {
      options: Object
    },

    mounted () {
      $(this.$el).scrollbar(this.options || {})
    },

    beforeDestroy () {
      $(this.$el).scrollbar('destroy')
    },

    render (h) {
      return h('div', {
        'class': 'scrollbar-inner'
      }, this.$slots.default)
    },

    methods: {
      scrollTop (top) {
        $(this.$el).scrollTop(top)
      }
    }
  }
</script>
