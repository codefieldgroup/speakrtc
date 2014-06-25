/**
 * Model User.
 */
'use strict';

app.factory('User', ['$resource', function ($resource) {
  return $resource('/api/users/:id', {
    id: "@id"
  }, {
    query  : { method: 'GET', isArray: false },
    update : { method: 'PUT' },
    create : { method: 'POST' },
    destroy: { method: 'DELETE' }
  });
}]);