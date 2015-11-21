(function(module) {
  mifosX.controllers = _.extend(module, {
	  CreateVendorController: function(scope,webStorage,resourceFactory, location) {
      
    	scope.formData = {};
    	
        scope.submit = function() {   
            resourceFactory.supplierResource.save(this.formData,function(data){
            		location.path('/inventory');
            		webStorage.add("callingTab", {someString: "supplier" });
          });
        };
    }
  });
  mifosX.ng.application.controller('CreateVendorController', ['$scope','webStorage','ResourceFactory', '$location', mifosX.controllers.CreateVendorController]).run(function($log) {
    $log.info("CreateVendorController initialized");
  });
}(mifosX.controllers || {}));
