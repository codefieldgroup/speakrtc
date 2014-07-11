/**
 * Model User.
 */
'use strict';

app.factory('Log', ['$resource', function ($resource) {
  return $resource('/api/logs/:id', {
    id: "@id"
  }, {
    query  : { method: 'GET', isArray: false },
    update : { method: 'PUT' },
    create : { method: 'POST' },
    destroy: { method: 'DELETE' }
  });
}]);