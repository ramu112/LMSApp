(function(module) {
    lms.controllers = _.extend(module, {
        ViewAuditController: function(scope, resourceFactory, routeParams) {
            scope.details = {};
            resourceFactory.auditResource.get({templateResource: routeParams.id} , function(data) {
                scope.details = data;
                scope.commandAsJson = data.commandAsJson;
                var obj = JSON.parse(scope.commandAsJson);
                scope.jsondata = [];
                _.each(obj,function(value,key){
                    scope.jsondata.push({name:key,property:value});
                });
            });
        }
    });
    lms.ng.application.controller('ViewAuditController', ['$scope', 'ResourceFactory', '$routeParams', lms.controllers.ViewAuditController]).run(function($log) {
        $log.info("ViewAuditController initialized");
    });
}(lms.controllers || {}));


