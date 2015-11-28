(function(module) {
  lms.controllers = _.extend(module, {
	  ViewTaxMappingController: function(scope, routeParams, resourceFactory ) {
        scope.taxmapping = {};
        scope.id = routeParams.id;
        
        resourceFactory.taxmappingResource.get({taxId: scope.id}, function(data) {
            scope.taxmapping = data;
            if(data.taxInclusive == 1){
            	scope.taxmapping.taxInclusive = true;
            }else{
            	scope.taxmapping.taxInclusive = false;
            }
        });
    }
  });
  lms.ng.application.controller('ViewTaxMappingController', [
       '$scope', 
       '$routeParams',
       'ResourceFactory',
       lms.controllers.ViewTaxMappingController
       ]).run(function($log) {
    	   $log.info("ViewTaxMappingController initialized");
       });
}(lms.controllers || {}));
