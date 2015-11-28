(function(module) {
    lms.controllers = _.extend(module, {
        ProfileController: function(scope,localStorageService) {
           scope.userDetails = localStorageService.get('userData');
            scope.status = 'Not Authenticated';
            if(scope.userDetails.authenticated==true){
                scope.status = 'Authenticated';
            }
        }
    });
    lms.ng.application.controller('ProfileController', ['$scope', 'localStorageService', lms.controllers.ProfileController]).run(function($log) {
        $log.info("ProfileController initialized");
    });
}(lms.controllers || {}));
