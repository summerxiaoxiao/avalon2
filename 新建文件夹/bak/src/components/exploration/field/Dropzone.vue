<script>
  import Drop from '../../mixins/drop'

  export default {
    name: 'field-dropzone',
    mixins: [
      Drop
    ],
    props: {
      tagName: String
    },
    render (h) {
      return h(this.tagName, this.$slots.default)
    }
  }
</script>
