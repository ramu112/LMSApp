(function(module) {
    lms.directives = _.extend(module, {
        ActivitiesDisplayPanelDirective: function() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template:
                    "<div class='display-panel' style='margin-top:15px;'>" +
                        "<div class='summary-header'>" +
                        "<div class='display-header-text'>{{title}}</div></div>" +
                        "<div ng-transclude></div></div>"
            };

        }
    });
}(lms.directives || {}));

lms.ng.application.directive("ngDisplaypanel", [lms.directives.ActivitiesDisplayPanelDirective]).run(function($log) {
    $log.info("ActivitiesDisplayPanelDirective initialized");
});