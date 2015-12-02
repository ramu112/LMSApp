(function(module) {
  lms.controllers = _.extend(module, {
    ViewAccountTransferDetailsController: function(scope, resourceFactory, location, routeParams) {

      resourceFactory.accountTransferResource.get({transferId:routeParams.id}, function(data){
        scope.transferData = data;
      });
    }
  });
  lms.ng.application.controller('ViewAccountTransferDetailsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', lms.controllers.ViewAccountTransferDetailsController]).run(function($log) {
    $log.info("ViewAccountTransferDetailsController initialized");
  });
}(lms.controllers || {}));
