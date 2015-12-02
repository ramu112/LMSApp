(function(module) {
    lms.controllers = _.extend(module, {
        ViewCodeController: function(scope, routeParams , resourceFactory, location ) {
                   scope.codevalues = [];
             resourceFactory.codeResources.get({codeId: routeParams.id} , function(data) {
                scope.code = data;
            });
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id} , function(data) {
                scope.codevalues = data;
            });
            scope.delcode = function(){
                resourceFactory.codeResources.remove({codeId: routeParams.id},this.code,function(data){
                    location.path('/codes');

                });
            }
        }
    });
    lms.ng.application.controller('ViewCodeController', ['$scope', '$routeParams','ResourceFactory','$location', lms.controllers.ViewCodeController]).run(function($log) {
        $log.info("ViewCodeController initialized");
    });
}(lms.controllers || {}));
