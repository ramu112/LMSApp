(function(module) {
  lms.controllers = _.extend(module, {
	  CancelProspectsController: function(scope, resourceFactory, location, routeParams) {
        
		  scope.statusRemarkDatas = [];
		  scope.prospectsData={};

        resourceFactory.prospectCancelResource.getProspects({prospectId : routeParams.id}, function(data) {
        	//alert(routeParams.id);
            scope.statusRemarkDatas = data.statusRemarkData;
            scope.prospectsData.id=routeParams.id;
            scope.formData = {
            		
            };   
        });
        
        scope.submit = function() {
        	
          resourceFactory.prospectResource.delete({prospectId: routeParams.id}, this.formData,function(data){
        	 console.log("deleted");
            location.path('/leads');
          });
        };
    }
  });
  lms.ng.application.controller('CancelProspectsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', lms.controllers.CancelProspectsController]).run(function($log) {
    $log.info("CancelProspectsController initialized");
  });
}(lms.controllers || {}));
