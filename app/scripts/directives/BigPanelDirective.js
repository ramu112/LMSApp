(function(module) {
    lms.directives = _.extend(module, {
        BigPanelDirective: function() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template:
                    "<div class='panelbig'>" +
                        "<div class='panel-header'>" +
                        "<div class='alert-box panel-header-text'>{{title}}</div></div>" +
                        "<div ng-transclude></div></div>"
            };

        }
    });
}(lms.directives || {}));

lms.ng.application.directive("panelbig", [lms.directives.BigPanelDirective]).run(function($log) {
    $log.info("BigPanelDirective initialized");
});