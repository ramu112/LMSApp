(function(module) {
  mifosX.controllers = _.extend(module, {
	  AddGRNController: function(scope,webStorage, resourceFactory, location,dateFilter,$rootScope) {
        scope.itemDatas = [];
        scope.officeDatas = [];
        scope.supplierDatas = [];
        scope.formData = {};
        scope.formData.purchaseDate = new Date();
        
        resourceFactory.grnTemplateResource.get(function(data) {
        	scope.itemDatas = data.itemData;
            scope.officeDatas = data.officeData;
            scope.supplierDatas = data.supplierData;
        });
        scope.selectedGRN=function(){
        	webStorage.add("callingTab", {someString: "grn" });
        };
        
        scope.reset123 = function(){
	    	   webStorage.add("callingTab", {someString: "grn" });
	       };
                
        scope.submit = function() {
        	this.formData.locale = "en";
        	var reqDate = dateFilter(scope.formData.purchaseDate,'dd MMMM yyyy');
            this.formData.dateFormat = 'dd MMMM yyyy';
            this.formData.purchaseDate = reqDate;
            resourceFactory.grnResource.save(this.formData,function(data){
           
            	location.path('/inventory');
          });
        };
    }
  });
  mifosX.ng.application.controller('AddGRNController', ['$scope','webStorage', 'ResourceFactory', '$location','dateFilter','$rootScope', mifosX.controllers.AddGRNController]).run(function($log) {
    $log.info("AddGRNController initialized");
  });
}(mifosX.controllers || {}));
