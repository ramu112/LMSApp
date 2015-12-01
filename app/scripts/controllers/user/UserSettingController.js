(function(module) {
  lms.controllers = _.extend(module, {
    UserSettingController: function(scope, translate,localStorageService) {
        if(localStorageService.getFromLocalStorage('Language')){
            var temp=localStorageService.getFromLocalStorage('Language');
            for(var i in lms.models.Langs){
                if(lms.models.Langs[i].code == temp.code){
                    scope.optlang = lms.models.Langs[i];
                }
            }
        }else{
            scope.optlang = scope.langs[0];
        }
        translate.uses(scope.optlang.code);

      scope.langs = lms.models.Langs;
      scope.changeLang = function (lang) {
          translate.uses(lang.code);
          localStorageService.addToLocalStorage('Language',scope.optlang);
      };

    }
  });

  lms.ng.application.controller('UserSettingController', ['$scope', '$translate','localStorageService', lms.controllers.UserSettingController]).run(function($log) {
    $log.info("UserSettingController initialized");
  });
}(lms.controllers || {}));