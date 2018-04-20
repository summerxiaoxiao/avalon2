requirejs(['/ccf.core/scripts/ccfcore.js',
  '/ccf.portal/scripts/plugins/utils.js',
  '/ccf.portal/scripts/plugins/event.js',
  '/ccf.core/scripts/lapp/apputils.js',
  '/ccf.core/scripts/lapp/ccf.js'], function () {
  requirejs(['/ccf.portal/plugins/amd/register.js',
    'notific8', 'bootstrapDateTimepicker'], function () {
    if ($.fn.datetimepicker) {
      window.isReuqireLoad = true
    }
  })
})
