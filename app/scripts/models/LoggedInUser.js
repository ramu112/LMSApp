(function(module) {
  lms.models = _.extend(module, {
    LoggedInUser: function(data) {
      this.name = data.username;
      this.userPermissions = data.userPermissions || data.permissions || [];
      
      this.getHomePageIdentifier = function() {
        var role = _.first(data.selectedRoles || data.roles);
        return lms.models.roleMap[role.id];
      };
    }
  });
}(lms.models || {}));
