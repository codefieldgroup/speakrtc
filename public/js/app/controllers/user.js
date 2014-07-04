/**
 * Controllers to working with users forms.
 */
'use strict';

var userCtrl = {
  /**
   * Controllers by Routes.
   */

  /**
   * Controller User Model: Show all users.
   * Router:
   * .when('/users', {
   *     templateUrl: '_users',
   *     controller : usersCtrl
   * })
   *
   * @param $scope
   * @param $rootScope
   * @param User
   */
  users: function ($scope, $rootScope, User) {
    $rootScope.title = 'SpeakRTC: Users';

    // Get all users.
    User.query(function (result) {
      if (result.type == 'success') {
        $scope.users = result.users;
      }
      else {
        flashMessageLaunch(result.msg);
      }
    });
  },

  /**
   * Controllers without Routes.
   * These controllers have Templates instead of Routes.
   */

  /**
   * Controller User Model: Add user.
   * Template:
   * div(ng-include src=" '_add_user' ")
   *
   * @param $scope
   * @param User
   */
  add: function ($scope, User) {
    $scope.user = {
      is_admin: false,
      active  : true
    };

    /**
     * Add user function.
     *
     * @param user
     */
    $scope.add = function (user) {
      User.create({}, user, function (result) {
        if (result.type == 'success') {
          $scope.users.push(result.user);
          flashMessageLaunch(result.msg);

          $scope.user = {
            is_admin : false,
            active   : true,
            email    : '',
            name     : '',
            last_name: '',
            password : ''
          };

          if (!$scope.$$phase) {

            // This will kickstart angular to recognize the change.
            $scope.$apply();
          }
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    }
  }
};