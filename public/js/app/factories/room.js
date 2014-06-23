/**
 * Model Room.
 */
'use strict';

app.factory('Room', ['$resource', function ($resource) {
  return $resource('/api/rooms/:id', {
    id: "@id"
  }, {
    query  : { method: 'GET', isArray: true },
    update : { method: 'PUT' },
    create : { method: 'POST' },
    destroy: { method: 'DELETE' }
  });
}]);