(function(module) {
  lms.controllers = _.extend(module, {
    DataTableController: function(scope, resourceFactory) {

        resourceFactory.DataTablesResource.getAllDataTables(function(data) {
            scope.datatables = data;
        });

    }
  });
  lms.ng.application.controller('DataTableController', ['$scope', 'ResourceFactory', lms.controllers.DataTableController]).run(function($log) {
    $log.info("DataTableController initialized");
  });
}(lms.controllers || {}));
