(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name flightSearchEngineApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the flightSearchEngineApp
   */
  angular
      .module('flightSearchEngineApp')
      .controller('FlightSearchController', FlightSearchController);

  FlightSearchController.$inject = ['FlightSearchService'];

  function FlightSearchController (FlightSearchService) {
    var vm = this;
    var today = new Date();
    var maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);

    vm.init = function() {
      vm.fromAirportList = [];
      vm.toAirportList = [];
      vm.flightResults = [];
      vm.passengerSelectItems = [1,2,3,4,5,6,7,8,9,10];
      vm.alerts = [];

      vm.filters = {
        airports: {
          from: undefined,
          to: undefined
        },
        departure: {
          datePopupOpened: false,
          date: null
        },
        return: {
          datePopupOpened: false,
          date: null
        },
        passengerCount: null,
        priceRangeStart: 0,
        priceRangeEnd: 200,
        isRoundTrip: true
      };

      FlightSearchService.getFromAirportList(function(responseData) {
        vm.fromAirportList = responseData;
      });

      vm.departureDateOptions = {
        formatYear: 'yy',
        maxDate: maxDate,
        minDate: today,
        startingDay: 1
      };
      vm.returnDateOptions = {
        formatYear: 'yy',
        maxDate: maxDate,
        minDate: today,
        startingDay: 1
      };
      vm.dateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      vm.dateFormat = vm.dateFormats[0];
    };

    vm.openDepartureDatePopup = function() {
      vm.filters.departure.datePopupOpened=true;
    };
    vm.openReturnDatePopup = function() {
      vm.filters.return.datePopupOpened=true;
    };

    vm.fromAirportSelected = function() {
      FlightSearchService.getToAirportList(vm.filters.airports.from, function(responseData) {
        vm.toAirportList = responseData;
      });
    };

    vm.searchFlights = function() {
      vm.alerts = [];
      filterValidation();
      if(vm.alerts.length > 0) {
        return;
      }

      FlightSearchService.searchFlights(vm.filters, function(responseData) {
        vm.flightResults = responseData;
      });
    };

    function filterValidation () {
      if(!vm.filters.airports.from) {
        vm.alerts.push({type: 'warning', msg: 'Departure airport is mandatory for flight search!'});
      }
      if(!vm.filters.airports.to) {
        vm.alerts.push({type: 'warning', msg: 'Arrival airport is mandatory for flight search!'});
      }
      if(!vm.filters.departure.date) {
        vm.alerts.push({type: 'warning', msg: 'Departure date is mandatory for flight search!'});
      }
      if(!vm.filters.passengerCount) {
        vm.alerts.push({type: 'warning', msg: 'You should choose passenger count!'});
      }
      if(vm.filters.isRoundTrip && !vm.filters.return.date) {
        vm.alerts.push({type: 'warning', msg: 'You should choose return date for return flight!'});
      }
    }

    vm.selectUnselectFlight = function (index) {
      vm.flightResults[index].isSelected =!vm.flightResults[index].isSelected;
    };

    vm.directionSelected = function(isRoundTrip) {
      vm.filters.isRoundTrip = isRoundTrip;
    };

    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };


    vm.init();
  }
})();
