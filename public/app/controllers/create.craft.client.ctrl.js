"use strict";

angular.module('pairToLearnApp')
  .controller('CreateCraftCtrl', ['CraftService', '$scope', '$location', '$timeout', '$rootScope', '$window', function(CraftService, $scope, $location, $timeout, $rootScope, $window) {

    $scope.createCraft = function(craft) {
      if (!craft) {
        return;
      }
      if (!$scope.craft.picture) {
        return;
      }
      var user = $scope.decodedToken.user.firstname;
      console.log(user);
      craft.createdBy = user;
      $rootScope.showProg = true;
      CraftService.createCraft(craft.picture, craft).then(function(data) {
        console.log(data);
        Materialize.toast('Craft created successfully!', 4000);
        $rootScope.showProg = false;
        $location.url("/admin/" + "crafts");
      }, function(err) {
        $rootScope.showProg = false;
        return data;
      });
    };

    $scope.Businessdashboard = function(craft) {
      var craftId = $rootScope.decodedToken.craft._id
      CraftService.getCraftDetails(craftId).then(function(res) {
        $rootScope.craftInformation = res;
        console.log($rootScope.craftInformation, "sleep");
            $scope.craft = res;
          });
      };
      console.log($scope.craftInformation );
      console.log($rootScope.craftInformation);
  

    $scope.updateCraft = function() {
      CraftService.updateCraft($scope.craft._id, $scope.craft).then(function(data) {
        Materialize.toast('Craft updated successfully!', 4000);
      })
    };
  }]);