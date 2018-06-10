requirejs(['/ccf.core/scripts/ccfcore.js',
  '/ccf.portal/scripts/plugins/utils.js',
  '/ccf.portal/scripts/plugins/event.js',
  '/ccf.core/scripts/lapp/apputils.js',
  '/ccf.core/scripts/lapp/ccf.js'], function () {
  requirejs(['/ccf.portal/plugins/amd/register.js',
    'notific8','jquery', 'zTable'], function () {
    window._module = {
      bbserver: ''
    }
    requirejs(['bootstrapDateTimepicker', 'select2'], function () {
      if ($.fn.datetimepicker) {
        console.log($.fn.datetimepicker)
        window.isReuqireLoad = true
      }
    })
  })
})
