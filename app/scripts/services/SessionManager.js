(function(module) {
  lms.services = _.extend(module, {
    SessionManager: function($rootScope,webStorage, httpService, resourceFactory) {
      var EMPTY_SESSION = {};

      this.get = function(data) {
        webStorage.add("sessionData", {userId: data.userId, authenticationKey: data.base64EncodedAuthenticationKey});
        httpService.setAuthorization(data.base64EncodedAuthenticationKey);
        return {user: new lms.models.LoggedInUser(data)};
      }

      this.clear = function() {
        webStorage.remove("sessionData");
        httpService.cancelAuthorization();
        return EMPTY_SESSION;
      };

      this.restore = function(handler) {
        var sessionData = webStorage.get('sessionData');
        if (sessionData !== null) {
          httpService.setAuthorization(sessionData.authenticationKey);
          resourceFactory.userResource.get({userId: sessionData.userId}, function(userData) {
        	$rootScope.isSaleUser = angular.lowercase(userData.username) == 'sale' ? true :false;
        	userData.userPermissions = sessionData.userPermissions;
            handler({user: new lms.models.LoggedInUser(userData)});
          });
        } else {
          handler(EMPTY_SESSION);
        }
      };
    }
  });
  lms.ng.services.service('SessionManager', [
    '$rootScope',
    'webStorage',
    'HttpService',
    'ResourceFactory',
    lms.services.SessionManager
  ]).run(function($log) {
    $log.info("SessionManager initialized");
  });
}(lms.services || {}));
