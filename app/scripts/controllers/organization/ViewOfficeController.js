(function(module) {
  lms.controllers = _.extend(module, {
    ViewOfficeController: function(scope, routeParams , resourceFactory ) {
        scope.charges = [];
        resourceFactory.officeResource.get({officeId: routeParams.id} , function(data) {
            scope.office = data;
        });
    }
  });
  lms.ng.application.controller('ViewOfficeController', ['$scope', '$routeParams','ResourceFactory', lms.controllers.ViewOfficeController]).run(function($log) {
    $log.info("ViewOfficeController initialized");
  });
}(lms.controllers || {}));
