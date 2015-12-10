(function(module) {
    lms.controllers = _.extend(module, {
        ClientIdentifierController: function(scope, routeParams , location, resourceFactory) {
            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.documenttypes = [];
            resourceFactory.clientIdenfierTemplateResource.get({clientId: routeParams.clientId}, function(data) {
                scope.documenttypes = data.allowedDocumentTypes;
                scope.formData.documentTypeId = data.allowedDocumentTypes[0].id;
            });

            scope.submit = function () {
                resourceFactory.clientIdenfierResource.save({clientId:scope.clientId},this.formData,function(data){
                    location.path('/viewclient/' + data.clientId);
                });
            };

        }
    });
    lms.ng.application.controller('ClientIdentifierController', ['$scope', '$routeParams', '$location', 'ResourceFactory', lms.controllers.ClientIdentifierController]).run(function($log) {
        $log.info("ClientIdentifierController initialized");
    });
}(lms.controllers || {}));

