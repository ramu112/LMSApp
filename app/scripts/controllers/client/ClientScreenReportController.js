(function(module) {
  lms.controllers = _.extend(module, {
    ClientScreenReportController: function(scope, resourceFactory, location, $http, API_VERSION, routeParams,$rootScope) {
        resourceFactory.templateResource.get({entityId : 0, typeId : 0}, function(data) {
            scope.clientTemplateData = data;
        });
        
        scope.getClientTemplate = function(templateId) {
          scope.selectedTemplate = templateId;
          $http({
            method:'POST',
            url: $rootScope.hostUrl + API_VERSION + '/templates/'+templateId+'?clientId='+routeParams.clientId,
            data: {}
          }).then(function(data) {
                scope.template = data.data;
          });
        };
    }
  });
  lms.ng.application.controller('ClientScreenReportController', ['$scope', 'ResourceFactory', '$location','$http', 'API_VERSION', '$routeParams','$rootScope', lms.controllers.ClientScreenReportController]).run(function($log) {
    $log.info("ClientScreenReportController initialized");
  });
}(lms.controllers || {}));
