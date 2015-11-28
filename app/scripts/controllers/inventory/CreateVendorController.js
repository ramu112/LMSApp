(function(module) {
  lms.controllers = _.extend(module, {
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
  lms.ng.application.controller('CreateVendorController', ['$scope','webStorage','ResourceFactory', '$location', lms.controllers.CreateVendorController]).run(function($log) {
    $log.info("CreateVendorController initialized");
  });
}(lms.controllers || {}));
