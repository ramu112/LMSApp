(function(module) {
    lms.controllers = _.extend(module, {
        ProductMixController: function(scope, resourceFactory) {
            scope.productmixes = [];
            resourceFactory.loanProductResource.getAllLoanProducts({associations:'productMixes'},function(data) {
                scope.productmixes = data;
            });
        }
    });
    lms.ng.application.controller('ProductMixController', ['$scope', 'ResourceFactory', lms.controllers.ProductMixController]).run(function($log) {
        $log.info("ProductMixController initialized");
    });
}(lms.controllers || {}));
