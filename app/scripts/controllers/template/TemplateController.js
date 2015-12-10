(function(module) {
  lms.controllers = _.extend(module, {
    TemplateController: function(scope, resourceFactory) {
        resourceFactory.templateResource.get(function(data) {
            scope.templates = data;
        });
    }
  });
  lms.ng.application.controller('TemplateController', ['$scope', 'ResourceFactory', lms.controllers.TemplateController]).run(function($log) {
    $log.info("TemplateController initialized");
  });
}(lms.controllers || {}));
