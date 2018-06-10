<script>
  export default {
    name: 'grid',
    props: {
      rows: Array,
      data: {
        type: Object,
        'default' () {
          return {}
        }
      }
    },
    render (h) {
      const rowNodes = []
      this.rows.forEach(cols => {
        const columnNodes = []
        const visibleCols = cols.filter(col => col.show !== false)
        if (!visibleCols.length) {
          return
        }
        visibleCols.forEach((col, i) => {
          const props = col.props
          if (col.key in this.data) {
            Object.assign(props, {data: this.data[col.key]})
          }

          const componentNode = h(col.component, {
            key: `${i}` + (col.key ? col.key : ''),
            props: props,
            on: col.on
          })

          columnNodes.push(h('div', {
            'class': 'col-md-' + col.span
          }, [componentNode]))
        })

        const rowClasses = ['row']
        if (columnNodes.length > 1) {
          rowClasses.push('row-stretch')
        }
        const rowNode = h('div', {
          'class': rowClasses
        }, columnNodes)

        rowNodes.push(rowNode)
      })

      return h('div', {
        // 'class': 'container-fluid'
      }, rowNodes)
    }
  }
</script>
