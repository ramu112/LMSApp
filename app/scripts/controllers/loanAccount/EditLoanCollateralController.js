(function(module) {
  lms.controllers = _.extend(module, {
    EditLoanCollateralController: function(scope, resourceFactory, routeParams, location) {

        scope.loanId = routeParams.loanId;
        scope.collateralId = routeParams.id;
        resourceFactory.loanResource.get({ resourceType:'collaterals', loanId:scope.loanId, resourceId:scope.collateralId, template:true }, function(data) {
          scope.formData = {collateralTypeId:data.type.id, value:data.value, description: data.description};
          scope.collateralTypes = data.allowedCollateralTypes;
        });

        scope.cancel = function() {
          location.path('/viewloanaccount/' + scope.loanId);
        };

        scope.submit = function() {
    			this.formData.locale = 'en';
    			resourceFactory.loanResource.put({resourceType:'collaterals', resourceId:scope.collateralId, loanId:scope.loanId}, this.formData, function(data){
    				location.path('/viewloanaccount/' + data.loanId);
    			});
    		};

    }
  });
  lms.ng.application.controller('EditLoanCollateralController', ['$scope', 'ResourceFactory', '$routeParams', '$location', lms.controllers.EditLoanCollateralController]).run(function($log) {
    $log.info("EditLoanCollateralController initialized");
  });
}(lms.controllers || {}));
