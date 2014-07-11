/**
 * Controllers to working with logs forms.
 */
'use strict';

var logCtrl = {
  /**
   * Controllers by Routes.
   */

  /**
   * Controller Log Model: Show all logs.
   * Router:
   * .when('/logs', {
   *     templateUrl: '_logs',
   *     controller : logCtrl.logs
   * })
   *
   * @param $scope
   * @param $rootScope
   * @param $location
   * @param Log
   */
  all: function ($scope, $rootScope, $location, Log) {
    $rootScope.title = 'SpeakRTC: Logs';

    $rootScope.logs = {};
    $scope.show_more = false;
    var limit = 10;
    var skip = 0;

    // Get all.
    Log.query({skip: skip, limit: limit}, function (result) {
      if (result.type == 'success') {
        $rootScope.logs = result.logs;
        skip = skip + 11;
        $scope.show_more = true;
      }
      else {
        flashMessageLaunch(result.msg);
        $location.path('/rooms');
      }
    });

    /**
     * Show more logs (CU Infinite Scroll Logs).
     */
    $scope.more = function () {
      Log.query({skip: skip, limit: limit}, function (result) {
        if (result.type == 'success') {
          if (result.logs.length > 0) {
            if (skip == 0) {
              $rootScope.logs = result.logs;
              skip = skip + 11;
            }
            else {
              result.logs.forEach(function (log) {
                $scope.logs.push(log);
              });
              skip = skip + 10;
            }
            $scope.show_more = true;
          }
          else {
            flashMessageLaunch({ msg: 'For the moment not more logs find.', type: 'success' });
          }
        }
        else {
          flashMessageLaunch(result.msg);
          $location.path('/rooms');
        }
      });
    };

    /**
     * Advanced search.
     *
     * @param search
     */
    $scope.advancedSearch = function (search) {
      limit = 10;
      skip = 0;

      Log.query(search, function (result) {
        if (result.type == 'success') {
          $rootScope.logs = result.logs;
          $scope.show_more = false;
        }
        else {
          flashMessageLaunch(result.msg);
          $location.path('/rooms');
        }
      });
    };

    /**
     * Reset advanced search.
     */
    $scope.reset = function () {
      limit = 10;
      skip = 0;

      $scope.search = {
        type  : '',
        method: '',
        ip    : ''
      }
      $scope.more();
    };
  }

  /**
   * Controllers without Routes.
   * These controllers have Templates instead of Routes.
   */


};