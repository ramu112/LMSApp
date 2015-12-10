(function(module) {
  lms.controllers = _.extend(module, {
	  ViewItemDetailController: function(scope, routeParams , resourceFactory ,location) {
        scope.itemDetailData = [];
        resourceFactory.singleItemDetailResource.get({itemId: routeParams.id} , function(data) {
        	scope.itemDetailData = data;
        });
        
    }
  });
  lms.ng.application.controller('ViewItemDetailController', ['$scope', '$routeParams','ResourceFactory', '$location',lms.controllers.ViewItemDetailController]).run(function($log) {
    $log.info("ViewItemDetailsController initialized");
  });
}(lms.controllers || {}));
