(function(module) {
  lms.controllers = _.extend(module, {
	  EditTaxMappingController: function(scope, routeParams, resourceFactory, location,dateFilter,$rootScope) {
		  scope.start = {};
		  scope.id = routeParams.id;
        
         resourceFactory.taxmappingResource.get({taxId: scope.id, template: 'true'} , function(data) {
             scope.taxTypeDatas = data.taxTypeData;
             scope.chargeTypeDatas = data.chargeTypeData;
             scope.formData = {
            		 taxCode 	: data.taxCode,
            		 chargeType : data.chargeType,
            		 taxType : data.taxType,
            		 rate : data.rate,
             }
             if (data.taxInclusive === 1) {
					scope.formData.taxInclusive = true;
			 }else{
				 scope.formData.taxInclusive = false;
			 }
            
             scope.start.date = new Date(dateFilter(data.startDate,'dd MMMM yyyy'));  
         });
        
         scope.submit = function() {
        	
        	 scope.formData.locale ='en';
        	 scope.formData.dateFormat = 'dd MMMM yyyy';
        	 if(scope.start.date){
        		 scope.formData.startDate = dateFilter(scope.start.date, 'dd MMMM yyyy');
        	 }
             resourceFactory.taxmappingResource.update({'taxId': scope.id}, scope.formData, function(data){
            	 location.path('/viewtaxmapping/' + data.resourceId);
             });
        };
    }
  });
  lms.ng.application.controller('EditTaxMappingController', [
       '$scope',
       '$routeParams',
       'ResourceFactory',
       '$location',
       'dateFilter',
       lms.controllers.EditTaxMappingController
       ]).run(function($log) {
    	   $log.info("EditTaxMappingController initialized");
       });
}(lms.controllers || {}));