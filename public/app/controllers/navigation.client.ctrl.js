'use strict';

angular.module('pairToLearnApp')
  .controller('NavCtrl', ['UserService', '$rootScope', '$scope', '$location', '$window', '$timeout', '$route',
    function(UserService, $rootScope, $scope, $location, $window, $timeout, $route) {
      (function($) {
        $(function() {
          $('.dropdown-button')
            .dropdown({
              inDuration: 300,
              outDuration: 225,
              constrain_width: false, // Does not change width of dropdown to that of the activator
              hover: true, // Activate on hover
              gutter: 0, // Spacing from edge
              belowOrigin: true // Displays dropdown below the button
            });
        });
        $('.button-collapse')
          .sideNav({
            menuWidth: 180, // Default is 240
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
          });
      })(jQuery);

      $rootScope.showProg = false;

      $rootScope.$on("$routeChangeSuccess", function(event) {
        if ($window.sessionStorage.token) {
          var parseJwt = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
          };
          var decodedToken = parseJwt($window.sessionStorage.token);
          $rootScope.decodedToken = decodedToken;
          console.log($rootScope.decodedToken);
          $rootScope.isLoggedIn = true;
        } else {
          $rootScope.isLoggedIn = false;
        }

        //show features link only on homepage
        if ($location.path() === '/home') {
          $rootScope.hideFeatures = false;
        } else {
          $rootScope.hideFeatures = true;
        }
      });

      $rootScope.addProfilePic = function(profpic) {
        console.log(profpic);
        if (!profpic) {
          return;
        }
        $rootScope.showProg = true;
        UserService.uploadPic(profpic, $scope.decodedToken.user).then(function(data) {
            Materialize.toast('Picture updated successfully!', 4000);
            $window.sessionStorage.token = data.token;
            console.log(data);
            $rootScope.showProg = false;
            $route.reload();
          },
          function(err) {
            $rootScope.showProg = false;
          });
      };

      $rootScope.logout = function() {
        $window.sessionStorage.clear();
        $timeout(function() {
          $rootScope.hideOutProg = true;
          $window.location.href = "#/home";
          Materialize.toast('You are signed out!', 2000);
        }, 1500);
      };

      $scope.editProfile = function() {
        UserService.updateProfile($scope.decodedToken.user._id, $scope.decodedToken.user).then(function(res) {
          Materialize.toast('Profile updated successfully!', 4000);
          $window.sessionStorage.token = res.data.token;
          $location.url("/user/" + res.data.user._id + '/profile');
        });
      };
    }
  ]);
