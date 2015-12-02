(function(module) {
  lms.controllers = _.extend(module, {
	  ViewMrnController: function(scope, routeParams , resourceFactory ,location,webStorage) {
        scope.mrn = [];
        
        scope.selectedMRN=function(){
        	webStorage.add("callingTab", {someString: "mrn" });
        };
        resourceFactory.mrnResource.get({mrnId: routeParams.id} , function(data) {
        	scope.mrn = data;
        });
        
/*        	scope.deleteItem = function(){
            resourceFactory.itemResource.delete({itemId: routeParams.id},{},function(data){
                location.path('/inventory');

        });
        }*/
    }
  });
  lms.ng.application.controller('ViewMrnController', ['$scope', '$routeParams','ResourceFactory', '$location','webStorage',lms.controllers.ViewMrnController]).run(function($log) {
    $log.info("ViewMrnController initialized");
  });
}(lms.controllers || {}));
