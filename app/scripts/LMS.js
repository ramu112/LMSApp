var lms = (function(module) {
  module.ng = {
    config: angular.module('config_params' , ['configurations']),
    services: angular.module('LMS_Services', ['ngResource']),
    application: angular.module('LMS_Application', ['LMS_Services', 'config_params', 'webStorageModule', 'ui.bootstrap' , 'pascalprecht.translate','nvd3ChartDirectives','notificationWidget', 'angularFileUpload','modified.datepicker','ngSanitize','LocalStorageModule','ngCsv'])
  };
  return module;
}(lms || {}));

