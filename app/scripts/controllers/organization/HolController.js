(function(module) {
    lms.controllers = _.extend(module, {
        HolController: function(scope, resourceFactory) {
            scope.holidays = [];
            scope.offices = [];
            scope.formData={officeId:1};
            resourceFactory.holResource.getAllHols({officeId:scope.formData.officeId},function(data){
                scope.holidays = data;
            });
            resourceFactory.officeResource.getAllOffices(function(data){
                scope.offices = data;
            });
            scope.getHolidays = function(){
                resourceFactory.holResource.getAllHols({officeId:scope.formData.officeId},function(data){
                    scope.holidays = data;
                });
            };
        }
    });
    lms.ng.application.controller('HolController', ['$scope', 'ResourceFactory', lms.controllers.HolController]).run(function($log) {
        $log.info("HolController initialized");
    });
}(lms.controllers || {}));

