(function(module) {
  lms.controllers = _.extend(module, {
    ChargeController: function(scope, resourceFactory) {
        scope.charges = [];
        scope.$broadcast('ChargeDataLoadingStartEvent');
        resourceFactory.chargeResource.getAllCharges(function(data) {
            scope.charges = data;
            scope.$broadcast('ChargeDataLoadingCompleteEvent');
        });
    }
  });
  lms.ng.application.controller('ChargeController', ['$scope', 'ResourceFactory', lms.controllers.ChargeController]).run(function($log) {
    $log.info("ChargeController initialized");
  });
}(lms.controllers || {}));
