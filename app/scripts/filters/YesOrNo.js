(function(module) {
    lms.filters = _.extend(module, {
        YesOrNo: function () {
            return function(input) {
                var status;
                if(input==true){
                    status = 'Yes';
                } else if(input==false){
                    status = 'No';
                }
                return status;
            }
        }
    });
    lms.ng.application.filter('YesOrNo', ['dateFilter',lms.filters.YesOrNo]).run(function($log) {
        $log.info("YesOrNo filter initialized");
    });
}(lms.filters || {}));
