(function(module) {
  mifosX.controllers = _.extend(module, {
	  EditFeeMasterController: function(scope, routeParams, resourceFactory, location,$rootScope,webStorage) {
	        
	        scope.feeMasterData = [];
	        scope.formData = {};scope.id = routeParams.id;
	        resourceFactory.feeMasterResource.get({id: routeParams.id} , function(data) {
	            scope.feeMasterData = data.feeMasterData;
	            scope.transactionTypeDatas 		= data.transactionTypeDatas;
	            scope.chargeCalculationTypeOptions = data.chargeCalculationTypeOptions;
	            scope.chargeTimeTypeOptions = data.chargeTimeTypeOptions;
	            
	            scope.formData.feeCode 			= scope.feeMasterData.feeCode;
	            scope.formData.feeDescription 	= scope.feeMasterData.feeDescription;
	            scope.formData.transactionType	= scope.feeMasterData.transactionType;
	            scope.formData.chargeTimeType 	= scope.feeMasterData.chargeTimeType.id;
	            scope.formData.chargeCalculationType = scope.feeMasterData.chargeCalculationType.id;
	            scope.formData.defaultFeeAmount = scope.feeMasterData.defaultFeeAmount;
	            
	            if(scope.feeMasterData.isRefundable != undefined){
	            	scope.formData.isRefundable = scope.feeMasterData.isRefundable == 'Y'?true:false;
	            }
	            
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
	             resourceFactory.feeMasterResource.update({id:routeParams.id},scope.formData,function(data){
	              location.path('/viewfeemaster/'+data.resourceId);
	            });
	          };
	  }
  });
  mifosX.ng.application.controller('EditFeeMasterController', ['$scope', '$routeParams', 'ResourceFactory', '$location','$rootScope','webStorage', mifosX.controllers.EditFeeMasterController]).run(function($log) {
    $log.info("EditFeeMasterController initialized");
  });
}(mifosX.controllers || {}));
