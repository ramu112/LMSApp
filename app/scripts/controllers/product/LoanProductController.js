(function(module) {
  lms.controllers = _.extend(module, {
    LoanProductController: function(scope, resourceFactory) {

        scope.products = [];
        scope.$broadcast('LoanProductDataLoadingStartEvent');
        resourceFactory.loanProductResource.getAllLoanProducts(function(data) {
            scope.loanproducts = data;
			      scope.$broadcast('LoanProductDataLoadingCompleteEvent');
        });

    }
  });
  lms.ng.application.controller('LoanProductController', ['$scope', 'ResourceFactory', lms.controllers.LoanProductController]).run(function($log) {
    $log.info("LoanProductController initialized");
  });
}(lms.controllers || {}));
