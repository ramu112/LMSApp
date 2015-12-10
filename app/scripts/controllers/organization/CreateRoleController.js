(function(module) {
  lms.controllers = _.extend(module, {
    CreateRoleController: function(scope, location, resourceFactory) {
      scope.formData = {};
      scope.submit = function() {
        resourceFactory.roleResource.save(this.formData, function(data) {
          location.path("/admin/viewrole/"+data.resourceId);
        });
      };
    }
  });
  lms.ng.application.controller('CreateRoleController', ['$scope', '$location', 'ResourceFactory', lms.controllers.CreateRoleController]).run(function($log) {
    $log.info("CreateRoleController initialized"); 
  });
}(lms.controllers || {}));