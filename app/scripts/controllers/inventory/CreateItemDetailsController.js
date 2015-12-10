(function(module) {
  lms.controllers = _.extend(module, {
    CreateItemDetailsController: function(scope,webStorage, resourceFactory, routeParams, location,$rootScope) {
    	 scope.formData = [];
    	 scope.grnIds = [];
    	 scope.itemDetailsData=[];
    	 scope.inventoryGrnDatas=[];
    	 scope.qualityDatas=[];
    	 scope.statusDatas=[];
        resourceFactory.itemDetailTemplateResource.get({grnId: routeParams.id === undefined ? "":routeParams.id} ,function(data) {
        	scope.formData = data;
            scope.inventoryGrnDatas = data.inventoryGrnDatas;
            scope.qualityDatas=data.qualityDatas;
            for(var i = 0 ; i < scope.qualityDatas.length; i++){
            	if(scope.qualityDatas[i].mCodeValue == 'Good'){
            		scope.itemDetailsData.quality = scope.qualityDatas[i].mCodeValue;
            	}
            }
            
            scope.statusDatas=data.statusDatas;

        });
       
        scope.changeGrn = function(testId) {
        	
            resourceFactory.grnResource.get({grnId: testId}, function(data) {
              scope.itemDetailsData = data;
            });
          };
          
          scope.getBoth =function(mrnId,description){
	        	return mrnId+"--"+description;
	       };
            
	       scope.reset123 = function(){
	    	   webStorage.add("callingTab", {someString: "itemDetails" });
	       };
	       
        scope.submit = function() {
        	this.formData.locale = "en";
        	this.formData.grnId = scope.itemDetailsData.id;//scope.grnIds.id;
        	this.formData.serialNumber = scope.itemDetailsData.serialNumber;
        	this.formData.quality = scope.itemDetailsData.quality === undefined?'Good':scope.itemDetailsData.quality;
        	this.formData.provisioningSerialNumber = scope.itemDetailsData.provisioningSerialNumber;
        	this.formData.status = scope.itemDetailsData.status === undefined?'New':scope.itemDetailsData.status;
        	this.formData.remarks = scope.itemDetailsData.remarks;
        	this.formData.itemMasterId = scope.itemDetailsData.itemMasterId;
        	if(scope.itemDetailsData.units != 'PIECES'){
        		//this.formData.quantity = 1;
        		this.formData.quantity = scope.itemDetailsData.balanceQuantity;
        	}/*else{
        		this.formData.quantity = scope.itemDetailsData.balanceQuantity;
        	}*/   	
            delete this.formData.purchaseDate;
            delete this.formData.inventoryGrnDatas;
            delete this.formData.qualityDatas;
            delete this.formData.statusDatas;
        	resourceFactory.itemDetailsResource.save(this.formData,function(data){
        		location.path("/inventory");
          });
        };
    }
  });
  lms.ng.application.controller('CreateItemDetailsController', ['$scope','webStorage', 'ResourceFactory','$routeParams','$location','$rootScope', lms.controllers.CreateItemDetailsController]).run(function($log) {
    $log.info("CreateItemDetailsController initialized");
  });
}(lms.controllers || {}));
