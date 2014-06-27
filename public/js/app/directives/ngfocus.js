/**
 * Directive to focus input when click in button.
 */
'use strict';

app.directive('ngfocus', function () {
  return {
    link: function (scope, element, attrs, controller) {
      element[0].focus();
    }
  };
});