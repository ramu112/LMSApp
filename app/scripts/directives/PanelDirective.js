(function(module) {
    lms.directives = _.extend(module, {
        PanelDirective: function() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template:
                    "<div class='panel'>" +
                    "<div class='panel-header'>" +
                    "<div class='alert-box panel-header-text'>{{title}}</div></div>" +
                    "<div ng-transclude></div></div>"
            };

        }
    });
}(lms.directives || {}));

lms.ng.application.directive("panel", [lms.directives.PanelDirective]).run(function($log) {
    $log.info("PanelDirective initialized");
});