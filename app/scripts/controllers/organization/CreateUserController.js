(function(module) {
  lms.controllers = _.extend(module, {
    CreateUserController: function(scope, resourceFactory, location) {
        scope.offices = [];
        scope.availableRoles = [];
        resourceFactory.userTemplateResource.get(function(data) {
            scope.offices = data.allowedOffices;
            scope.availableRoles = data.availableRoles;
            scope.formData = {
              sendPasswordToEmail: true,
              officeId : scope.offices[0].id,
            };
        });
        
        scope.submit = function() {   
            resourceFactory.userListResource.save(this.formData,function(data){
            location.path('/viewuser/' + data.resourceId);
          });
        };
    }
  });
  lms.ng.application.controller('CreateUserController', ['$scope', 'ResourceFactory', '$location', lms.controllers.CreateUserController]).run(function($log) {
    $log.info("CreateUserController initialized");
  });
}(lms.controllers || {}));
