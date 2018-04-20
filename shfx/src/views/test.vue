<template>
<div class='content-main'>
  <div class='container-fluid'>
    <div><h2>test</h2></div>
    <div style='height: 60%;width: 100%;' id='mytable' ref='mytable'></div>
  </div>
</div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'app-test',
    mounted () {
      this.$http.get('/static/datas/table.json').then((result) => {
        this.$http.get('/static/datas/table2.json').then((result2) => {
          var res = JSON.parse(JSON.stringify(result))
          var headers = result.headers.concat(result2.headers)
          res['headers'] = headers
          var datas = []
          $.each(result.datas, function (i, item) {
            $.each(result2.datas, function (i, item2) {
              if (item2['project_class_id'] === item['project_class_id'] &&
                  item2['organ_id'] === item['organ_id']) {
                for (var key in item2) {
                  item[key] = item2[key]
                }
              }
            })
            datas.push(item)
          })
          res.datas = datas
          this.load(res)
        })
      })
    },
    methods: {
      load (res) {
        $(this.$refs.mytable).zTable({
          data: res,
          format: {
            13: {
              1305: 10
            }
          },
          tableOpts: {
            height: $(this.$refs.mytable).height(),
            scrollY: $(this.$refs.mytable).height(),
            paging: true,
            pageLength: 500,
            isTotal: true,
            isFreezeArr: false,
            isUserDefinedCt: true
          }
        })
      }
    }
  }
</script>

<style>

</style>
