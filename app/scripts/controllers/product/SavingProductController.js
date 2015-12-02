 (function(module) {
  lms.controllers = _.extend(module, {
    SavingProductController: function(scope, resourceFactory) {

        scope.products = [];
        resourceFactory.savingProductResource.getAllSavingProducts(function(data) {
            scope.savingproducts = data;
        });

    }
  });
  lms.ng.application.controller('SavingProductController', ['$scope', 'ResourceFactory', lms.controllers.SavingProductController]).run(function($log) {
    $log.info("SavingProductController initialized");
  });
}(lms.controllers || {}));
