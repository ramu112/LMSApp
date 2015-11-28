(function(module) {
  lms.controllers = _.extend(module, {
    UserListController: function(scope, resourceFactory) {
        scope.users = [];
        resourceFactory.userListResource.getAllUsers(function(data) {
            scope.users = data;
        });
    }
  });
  lms.ng.application.controller('UserListController', ['$scope', 'ResourceFactory', lms.controllers.UserListController]).run(function($log) {
    $log.info("UserListController initialized");
  });
}(lms.controllers || {}));
