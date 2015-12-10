(function(module) {
  lms.controllers = _.extend(module, {
	  ViewMovedMrnController: function(scope, routeParams , resourceFactory) {
        scope.mrn = [];
        
        resourceFactory.moveMrnSaveResource.getMovedMrnResource({mrnId: routeParams.id} , function(data) {
        	scope.mrn = data;
        });
       
    }
  });
  lms.ng.application.controller('ViewMovedMrnController', ['$scope', '$routeParams','ResourceFactory',lms.controllers.ViewMovedMrnController]).run(function($log) {
    $log.info("ViewMovedMrnController initialized");
  });
}(lms.controllers || {}));
