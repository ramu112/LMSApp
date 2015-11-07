(function(module) {
  mifosX.controllers = _.extend(module, {
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
  mifosX.ng.application.controller('TaxMappingController', [
       '$scope', 
       'ResourceFactory',
       '$location',
       mifosX.controllers.TaxMappingController
       ]).run(function($log) {
    	   $log.info("TaxMappingController initialized");
       });
}(mifosX.controllers || {}));
