(function(module) {
  lms.controllers = _.extend(module, {
    LoginFormController: function(scope, authenticationService) {
      scope.loginCredentials = {};
      scope.authenticationFailed = false;

      scope.login = function() {
    	  scope.authenticationFailed = false;
        authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
        delete scope.loginCredentials.password;
      };
      $('#pwd').keypress(function(e) {
        if(e.which == 13) {
            scope.login();
        }
      });
      scope.$on("UserAuthenticationFailureEvent", function(data) {
        scope.authenticationFailed = true;
      });

    }
  });
  lms.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService', lms.controllers.LoginFormController]).run(function($log) {
    $log.info("LoginFormController initialized");
  });
}(lms.controllers || {}));
