(function(module) {
  lms.controllers = _.extend(module, {
    CreateEmployeeController: function(scope, resourceFactory, location) {
        scope.offices = [];
        resourceFactory.officeResource.getAllOffices(function(data) {
            scope.offices = data;
            scope.formData = {
              isLoanOfficer: true, 
              officeId : scope.offices[0].id,
            };
        });
        
        scope.submit = function() {   
            resourceFactory.employeeResource.save(this.formData,function(data){
            location.path('/viewemployee/' + data.resourceId);
          });
        };
    }
  });
  lms.ng.application.controller('CreateEmployeeController', ['$scope', 'ResourceFactory', '$location', lms.controllers.CreateEmployeeController]).run(function($log) {
    $log.info("CreateEmployeeController initialized");
  });
}(lms.controllers || {}));
