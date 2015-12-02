(function(module) {
  lms.controllers = _.extend(module, {
    ReportsController: function(scope, resourceFactory) {
        scope.reports = [];
        resourceFactory.reportsResource.getReport(function(data) {
            scope.reports = data;
        });
    }
  });
  lms.ng.application.controller('ReportsController', ['$scope', 'ResourceFactory', lms.controllers.ReportsController]).run(function($log) {
    $log.info("ReportsController initialized");
  });
}(lms.controllers || {}));
