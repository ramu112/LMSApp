(function(module) {
    lms.controllers = _.extend(module, {
        ViewHolController: function(scope,routeParams, resourceFactory) {

            resourceFactory.holValueResource.getholvalues({officeId:1,holId: routeParams.id} , function(data) {
                scope.holiday = data;
            });

        }
    });
    lms.ng.application.controller('ViewHolController', ['$scope','$routeParams', 'ResourceFactory', lms.controllers.ViewHolController]).run(function($log) {
        $log.info("ViewHolController initialized");
    });
}(lms.controllers || {}));

