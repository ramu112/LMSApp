(function(module) {
  lms.controllers = _.extend(module, {
	  EditSupplierController: function(scope,webStorage,resourceFactory, location,routeParams) {
      
    	scope.formData = {};
    	resourceFactory.supplierResource.get({'id': routeParams.id},function(data) {
            scope.formData= data[0];
           
        });
    	
        scope.submit = function() {   
        	delete scope.formData.id;
            resourceFactory.supplierResource.update({'id': routeParams.id},this.formData,function(data){
            		location.path('/inventory');
            		webStorage.add("callingTab", {someString: "supplier" });
          });
        };
    }
  });
  lms.ng.application.controller('EditSupplierController', ['$scope','webStorage','ResourceFactory', '$location','$routeParams', lms.controllers.EditSupplierController]).run(function($log) {
    $log.info("EditSupplierController initialized");
  });
}(lms.controllers || {}));
