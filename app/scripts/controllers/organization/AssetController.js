(function(module) {
  lms.controllers = _.extend(module, {
    AssetController: function(scope, resourceFactory) {
        scope.assets = [];
        resourceFactory.assetResource.getAllAssets(function(data) {
            scope.assets = data;
        });
    }
  });
  lms.ng.application.controller('AssetController', ['$scope', 'ResourceFactory', lms.controllers.AssetController]).run(function($log) {
    $log.info("AssetController initialized");
  });
}(lms.controllers || {}));
