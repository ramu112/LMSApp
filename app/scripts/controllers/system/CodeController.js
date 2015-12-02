(function(module) {
    lms.controllers = _.extend(module, {
        CodeController: function(scope, resourceFactory,location) {
            scope.codes = [];
            resourceFactory.codeResources.getAllCodes(function(data){
                scope.codes = data;
            });
            scope.routeTo = function(id){
                location.path('/viewcode/'+id);
            }
       }
     });
    lms.ng.application.controller('CodeController', ['$scope', 'ResourceFactory','$location', lms.controllers.CodeController]).run(function($log) {
        $log.info("CodeController initialized");
    });
}(lms.controllers || {}));
