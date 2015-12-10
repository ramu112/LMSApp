(function(module) {
  lms.controllers = _.extend(module, {
    ViewSchedulerJobController: function(scope, routeParams , resourceFactory ) {
      resourceFactory.jobsResource.getJobDetails({jobId : routeParams.id}, function(data) {
        scope.job = data;
      });
    }
  });
  lms.ng.application.controller('ViewSchedulerJobController', ['$scope', '$routeParams','ResourceFactory', lms.controllers.ViewSchedulerJobController]).run(function($log) {
    $log.info("ViewSchedulerJobController initialized");
  });
}(lms.controllers || {}));
