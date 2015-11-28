(function(module) {
  lms.controllers = _.extend(module, {
    ClientController: function(scope, resourceFactory , paginatorService) {
        
      scope.clients = [];

      var fetchFunction = function(offset, limit, callback) {
        resourceFactory.clientResource.getAllClients({offset: offset, limit: limit} , callback);
      };
      
      scope.clients = paginatorService.paginate(fetchFunction, 14);
    }
  });
  lms.ng.application.controller('ClientController', ['$scope', 'ResourceFactory', 'PaginatorService', lms.controllers.ClientController]).run(function($log) {
    $log.info("ClientController initialized");
  });
}(lms.controllers || {}));
