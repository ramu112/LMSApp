(function(module) {
  lms.controllers = _.extend(module, {
    MainController: function(scope, location, sessionManager, translate,localStorageService) {
    	
    	scope.domReady = true;
        scope.activity = {};
        scope.activityQueue = [];
        if(localStorageService.getFromLocalStorage('Location')){
            scope.activityQueue = localStorageService.getFromLocalStorage('Location');
        }
        
        scope.setPermissions = function (permissions) {
            scope.permissionList = permissions;
            localStorageService.addToLocalStorage('userPermissions', permissions);
            scope.$broadcast('permissionsChanged')
        };

        scope.hasPermission = function (permission) {
            permission = permission.trim();
            //FYI: getting all permissions from localstorage, because if scope changes permissions array will become undefined
            scope.permissionList = localStorageService.getFromLocalStorage('userPermissions');
            //If user is a Super user return true
            if (scope.permissionList && _.contains(scope.permissionList, "ALL_FUNCTIONS")) {
                return true;
            } else if (scope.permissionList && permission && permission != "") {
                //If user have all read permission return true
                if (permission.substring(0, 5) == "READ_" && _.contains(scope.permissionList, "ALL_FUNCTIONS_READ")) {
                    return true;
                } else if (_.contains(scope.permissionList, permission)) {
                    //check for the permission if user doesn't have any special permissions
                    return true;
                } else {
                    //return false if user doesn't have permission
                    return false;
                }
            } else {
                //return false if no value assigned to has-permission directive
                return false;
            }
            ;
        };
        
        
        scope.$watch(function() {
            return location.path();
        }, function() {
            scope.activity= location.path();
            scope.activityQueue.push(scope.activity);
            localStorageService.addToLocalStorage('Location',scope.activityQueue);
        });

        scope.leftnav = false;
        scope.$on("UserAuthenticationSuccessEvent", function(event, data) {
        scope.currentSession = sessionManager.get(data);
        if (scope.currentSession.user && scope.currentSession.user.userPermissions) {
            scope.setPermissions(scope.currentSession.user.userPermissions);
        } 
        scope.isSaleUser = angular.lowercase(scope.currentSession.user.name) == 'sale' ? true :false;
        location.path('/home').replace();
      });

      scope.search = function(){
          location.path('/search/' + scope.search.query );
      };
        scope.text =    '<span>Mifos X is designed by the <a href="http://www.openmf.org/">Mifos Initiative</a>.'+
                        '<a href="http://mifos.org/community"> A global community </a> thats aims to speed the elimination of poverty by enabling Organizations to more effectively and efficiently deliver responsible financial services to the world’s poor and unbanked </span><br/>'+
                        '<span>Sounds interesting?<a href="http://mifos.org/community/news/how-you-can-get-involved"> Get involved!</a></span>';

        scope.logout = function() {
        scope.currentSession = sessionManager.clear();
        location.path('/').replace();
      };

      scope.langs = lms.models.Langs;
        if(localStorageService.getFromLocalStorage('Language')){
            var temp=localStorageService.getFromLocalStorage('Language');
            for(var i in lms.models.Langs){
                if(lms.models.Langs[i].code == temp.code){
                    scope.optlang = lms.models.Langs[i];
                }
            }
        } else{
            scope.optlang = scope.langs[0];
        }
        translate.uses(scope.optlang.code);

      scope.isActive = function (route) {
          if(route == 'clients'){
              var temp = ['/clients','/groups','/centers'];
              for(var i in temp){
                  if(temp[i]==location.path()){
                      return true;
                  }
              }
          }
          else if(route == 'acc'){
              var temp1 = ['/accounting','/freqposting','/accounting_coa','/journalentry','/accounts_closure','/Searchtransaction','/accounting_rules'];
              for(var i in temp1){
                  if(temp1[i]==location.path()){
                      return true;
                  }
              }
          }
          else if(route == 'rep'){
              var temp2 = ['/reports/all','/reports/clients','/reports/loans','/reports/funds','/reports/accounting'];
              for(var i in temp2){
                  if(temp2[i]==location.path()){
                      return true;
                  }
              }
          }
          else if(route == 'admin'){
              var temp3 = ['/users/','/organization','/system','/products','/global'];
              for(var i in temp3){
                  if(temp3[i]==location.path()){
                      return true;
                  }
              }
          }
          else
          {
          var active = route === location.path();
          return active;
          }
      };

      scope.changeLang = function (lang) {
          translate.uses(lang.code);
          localStorageService.addToLocalStorage('Language',lang);
      };

      sessionManager.restore(function(session) {
        scope.currentSession = session;
        if (session.user != null && session.user.userPermissions) {
            scope.setPermissions(session.user.userPermissions);
            localStorageService.addToLocalStorage('userPermissions', session.user.userPermissions);
        }
      });
      
      scope.addition = function(a,b){
    	  return a+b;
      }
      scope.subtract = function(a,b){
    	  return a-b;
      }
    }
  });
  lms.ng.application.controller('MainController', [
    '$rootScope',
    '$location',
    'SessionManager',
    '$translate',
    'localStorageService',
    lms.controllers.MainController
  ]).run(function($log) {
    $log.info("MainController initialized");
  });
}(lms.controllers || {}));
