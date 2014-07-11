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
   *     controller : userCtrl.users
   * })
   *
   * @param $scope
   * @param $rootScope
   * @param $location
   * @param User
   */
  all: function ($scope, $rootScope, $location, User) {
    $rootScope.title = 'SpeakRTC: Users';

    $rootScope.users = {};

    // Get all users.
    User.query(function (result) {
      if (result.type == 'success') {
        $rootScope.users = result.users;
      }
      else {
        flashMessageLaunch(result.msg);
        $location.path('/rooms');
      }
    });
  },

  /**
   * Controller User Model: Edit user by ID.
   * Router:
   * .when('/users/:id', {
   *   templateUrl: '_user',
   *   controller : userCtrl.user
   * })
   *
   * @param $scope
   * @param $rootScope
   * @param $routeParams
   * @param User
   */
  one: function ($scope, $rootScope, $routeParams, User) {
    var userId = $routeParams.id;
    $rootScope.title = 'SpeakRTC: Edit User';

    $scope.user = {};

    // Get user by ID.
    User.get({id: userId}, function (result) {
      if (result.type == 'success') {
        $scope.user = result.user;
      }
      else {
        flashMessageLaunch(result.msg);
      }
    });

    /**
     * Action Edit user.
     *
     * @param user
     */
    $scope.edit = function (user) {
      User.update({id: user._id}, user, function (result) {
        if (result.type == 'success') {
          flashMessageLaunch(result.msg);
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    }
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
   * @param $rootScope
   * @param User
   */
  add: function ($scope, $rootScope, User) {
    $scope.user = {
      is_admin: false,
      active  : true
    };

    /**
     * Action Add user function.
     *
     * @param user
     */
    $scope.add = function (user) {
      User.create({}, user, function (result) {
        if (result.type == 'success') {
          $rootScope.users.push(result.user);
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
            $scope.$apply();
          }
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    }
  },

  /**
   * Controller User Model: Delete user by ID.
   * Template:
   * span.badge
   *    span.glyphicon.glyphicon-remove-circle.text-danger(ng-controller="userCtrl.delete",ng-click="delete(user)")
   *
   * @param $scope
   * @param User
   */
  delete: function ($scope, $rootScope, User) {

    /**
     * Action Delete user button.
     *
     * @param user
     */
    $scope.delete = function (user) {
      User.destroy({id: user._id}, function (result) {
        if (result.type == 'success') {
          flashMessageLaunch(result.msg);

          var old_users = $rootScope.users;
          var new_users = [];

          angular.forEach(old_users, function (user_check) {
            if (user_check._id !== user._id) {
              new_users.push(user_check);
            }
          });

          $rootScope.users = new_users;
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    };
  }
};
