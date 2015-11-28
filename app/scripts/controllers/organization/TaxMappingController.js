(function(module) {
  lms.controllers = _.extend(module, {
	  TaxMappingController: function(scope,resourceFactory,location) {
        scope.taxmappings = [];
        
        resourceFactory.taxmappingResource.query(function(data) {
            scope.taxmappings = data;
            for(var i in scope.taxmappings){
            	
            	if(scope.taxmappings[i].taxInclusive == 1){
            		scope.taxmappings[i].taxInclusive = true;
            	}else{
            		scope.taxmappings[i].taxInclusive = false;
            	}
            }
        });
    }
  });
  lms.ng.application.controller('TaxMappingController', [
       '$scope', 
       'ResourceFactory',
       '$location',
       lms.controllers.TaxMappingController
       ]).run(function($log) {
    	   $log.info("TaxMappingController initialized");
       });
}(lms.controllers || {}));
