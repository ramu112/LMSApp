(function(module) {
  mifosX.controllers = _.extend(module, {
	  CreateTaxMappingController: function(scope, resourceFactory, location, dateFilter) {
		  
        scope.start = {date : new Date()};
        scope.formData = {};
        scope.minDate = new Date();
        resourceFactory.taxmappingtemplateResource.getAlltaxmapping(function(data) {
            scope.taxTypeDatas = data.taxTypeData;
            scope.chargeTypeDatas = data.chargeTypeData;
        });
        
        scope.submit = function() {
        	scope.formData.locale = 'en';
        	scope.formData.dateFormat = 'dd MMMM yyyy';
        	scope.formData.startDate = dateFilter(scope.start.date, 'dd MMMM yyyy');
         
            resourceFactory.taxmappingResource.save(scope.formData, function(data){
            		location.path('/viewtaxmapping/' + data.resourceId);
            });
        };
    }
  });
  mifosX.ng.application.controller('CreateTaxMappingController', [
       '$scope', 
       'ResourceFactory',
       '$location',
       'dateFilter',
       mifosX.controllers.CreateTaxMappingController
       ]).run(function($log) {
    	   $log.info("CreateTaxMappingController initialized");
       });
}(mifosX.controllers || {}));