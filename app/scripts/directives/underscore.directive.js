(function(){
  'use strict';

  angular
    .module('flightSearchEngineApp')
    .factory('_', _);

  _.$inject=['$window'];
  function _ ($window) {
    return $window._;
  };

})();
