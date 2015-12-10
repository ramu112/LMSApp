(function(module) {
  lms.controllers = _.extend(module, {
    RoleController: function(scope, resourceFactory) {
      scope.roles = [];
      resourceFactory.roleResource.getAllRoles({}, function(data) {
        scope.roles = data;
      });
    }
  });
  lms.ng.application.controller('RoleController', ['$scope', 'ResourceFactory', lms.controllers.RoleController]).run(function($log) {
    $log.info("RoleController initialized"); 
  });
}(lms.controllers || {}));
