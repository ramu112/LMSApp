(function(module) {
  lms.controllers = _.extend(module, {
    EmployeeController: function(scope, resourceFactory) {
        scope.employees = [];
        resourceFactory.employeeResource.getAllEmployees(function(data) {
            scope.employees = data;
        });
    }
  });
  lms.ng.application.controller('EmployeeController', ['$scope', 'ResourceFactory', lms.controllers.EmployeeController]).run(function($log) {
    $log.info("EmployeeController initialized");
  });
}(lms.controllers || {}));
