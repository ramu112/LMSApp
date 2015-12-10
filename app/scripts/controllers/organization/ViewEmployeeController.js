(function(module) {
  lms.controllers = _.extend(module, {
    ViewEmployeeController: function(scope, routeParams , resourceFactory ) {
        scope.employee = [];
        resourceFactory.employeeResource.get({staffId: routeParams.id} , function(data) {
            scope.employee = data;
        });
    }
  });
  lms.ng.application.controller('ViewEmployeeController', ['$scope', '$routeParams','ResourceFactory', lms.controllers.ViewEmployeeController]).run(function($log) {
    $log.info("ViewEmployeeController initialized");
  });
}(lms.controllers || {}));
