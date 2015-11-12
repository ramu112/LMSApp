(function(module) {
  mifosX.controllers = _.extend(module, {
	  CreateFeeMasterController: function(scope,webStorage, resourceFactory, location,$rootScope) {
		  
		  scope.chargeDatas,scope.transactionTypeDatas = [];
		  scope.formData = {};
		  resourceFactory.feeMasterTemplateResource.get(function(data){
			 scope.chargeDatas = data.chargeDatas;
			 scope.transactionTypeDatas = data.transactionTypeDatas;
			 scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
             scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;
		  });
		  
        scope.submit = function() {
        	
         	if(scope.formData.transactionType == 'Deposit'){
          		var tempValue = scope.formData.isRefundable;
          		if(tempValue){
          			scope.formData.isRefundable = 'Y';
          		}else{
          			scope.formData.isRefundable = 'N';
          		}
          	}else{
          		delete scope.formData.itemId;
          		delete scope.formData.isRefundable;
          	}
          	scope.formData.locale = "en";
             resourceFactory.feeMasterResource.save(scope.formData,function(data){
              location.path('/viewfeemaster/' + data.resourceId);
            });
          };
          
	  }
  });
  mifosX.ng.application.controller('CreateFeeMasterController', ['$scope','webStorage', 'ResourceFactory', '$location','$rootScope', mifosX.controllers.CreateFeeMasterController]).run(function($log) {
    $log.info("CreateFeeMasterController initialized");
  });
}(mifosX.controllers || {}));
