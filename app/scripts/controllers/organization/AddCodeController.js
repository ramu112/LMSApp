
(function(module) {
    lms.controllers = _.extend(module, {
        AddCodeController: function(scope, resourceFactory, location) {
            scope.codes = [];
            resourceFactory.codeResources.getAllCodes(function(data) {
                scope.codes = data;
            });

    scope.submit = function() {
        resourceFactory.codeResources.save(this.formData,function(data){
            location.path('/codes');
        });
    };
        }
    });
    lms.ng.application.controller('AddCodeController', ['$scope', 'ResourceFactory', '$location', lms.controllers.AddCodeController]).run(function($log) {
        $log.info("AddCodeController initialized");
    });
}(lms.controllers || {}));

