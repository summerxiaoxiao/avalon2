<script>
  import $ from 'jquery'

  export default {
    props: {
      id: String,
      appending: Boolean,
      defaultFormat: {},
      format: {},
      type: [String, Number],
      config: Object,
      data: [Object, Array],
      editable: Boolean,
      width: Number,
      height: Number
    },
    methods: {
      getVisualTitleHeight () {
        let visualTitleHeight = 0
        if (this.$parent.$refs['visualTitle']) {
          visualTitleHeight = $(this.$parent.$refs['visualTitle']).height()
        }
        return visualTitleHeight
      }
    }
  }
</script>
