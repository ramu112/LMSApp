(function(module) {
    lms.controllers = _.extend(module, {
        CloseCenterController: function(scope, routeParams, route, location, resourceFactory,dateFilter) {
            scope.template = [];
            scope.center = [];
            scope.first = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            resourceFactory.centerResource.get({centerId: routeParams.id,associations:'groupMembers,collectionMeetingCalendar'} , function(data) {
                scope.center = data;
            });
            resourceFactory.centerTemplateResource.get({command:'close'}, function(data){
                scope.template = data;
                scope.formData.closureReasonId = data.closureReasons[0].id;
            });

            scope.closeGroup = function(){
                var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
                this.formData.closureDate = reqDate;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                resourceFactory.centerResource.save({centerId: routeParams.id ,command:'close'},this.formData, function(data){
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    lms.ng.application.controller('CloseCenterController', ['$scope', '$routeParams','$route', '$location', 'ResourceFactory','dateFilter', lms.controllers.CloseCenterController]).run(function($log) {
        $log.info("CloseCenterController initialized");
    });
}(lms.controllers || {}));

