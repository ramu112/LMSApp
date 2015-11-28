(function(module) {
	lms.controllers = _.extend(module, {
		FollowProspectsController : function(scope, resourceFactory, location,
				routeParams, dateFilter, $rootScope) {

			scope.assignedToDatas = [];
			scope.callStatusDatas = [];
			scope.prospectsData = {};
			scope.formData = {};
			scope.first = {};
			scope.first.date = new Date();
			scope.first.time = scope.first.date.getHours() + ":" + scope.first.date.getMinutes();

			scope.minDate = new Date();

			$('#timepicker1').timepicker({
				showInputs:false,
				showMeridian : false
			});

			resourceFactory.prospectFollowUpResource.get({prospectId : routeParams.id }, function(data) {
				scope.assignedToDatas = data.assignedToData;
				scope.callStatusDatas = data.callStatusData;
				scope.prospectsData.id = routeParams.id;
			});

			scope.submit = function() {
				scope.flag = true;
				this.formData.locale = $rootScope.locale.code;
				var reqDate = dateFilter(scope.first.date, 'yyyy-MM-dd');
				this.formData.preferredCallingTime = reqDate + " " + $('#timepicker1').val() + ":00";
				
				resourceFactory.prospectFollowUpResource.update({prospectId : routeParams.id }, this.formData, function(data) {
					location.path('/viewprospects/' + data.resourceId);
				}, function(errData) {
					scope.flag = false;
				});
			};
		}
	});
	lms.ng.application.controller('FollowProspectsController', [ 
	'$scope', 
	'ResourceFactory', 
	'$location', 
	'$routeParams',
	'dateFilter', 
	'$rootScope',
	lms.controllers.FollowProspectsController 
	]).run(function($log) {
		$log.info("FollowProspectsController initialized");			
	});
}(lms.controllers || {}));
