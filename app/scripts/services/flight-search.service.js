(function() {
  'use strict';

  angular
      .module('flightSearchEngineApp')
      .factory('FlightSearchService', FlightSearchService);

  FlightSearchService.$inject = ['$http', '_'];
  function FlightSearchService ($http, _) {
    function getFromAirportList(callbackFunc) {
      return $http.get('data/flights.json').success(function(data) {
          var airportData = [];
          for (var i=0; i<data.flights.length; i++) {
            if(_.findIndex(airportData, {code : data.flights[i].fromAirportCode}) < 0) {
              airportData.push({
                code: data.flights[i].fromAirportCode,
                name: data.flights[i].fromAirport,
                city: data.flights[i].fromAirportCity
              });
            }
          }
        callbackFunc(airportData);
      });
    }

    function getToAirportList(fromAirport ,callbackFunc) {
      return $http.get('data/flights.json').success(function(data) {
          var airportData = [];
          for (var i=0; i<data.flights.length; i++) {
            if(fromAirport.code === data.flights[i].fromAirportCode
                && _.findIndex(airportData, {code : data.flights[i].toAirportCode}) < 0) {
              airportData.push({
                code: data.flights[i].toAirportCode,
                name: data.flights[i].toAirport,
                city: data.flights[i].toAirportCity
              });
            }
          }
        callbackFunc(airportData);
      });
    }

    function searchFlights(filters, callbackFunc) {
      var successCallback = function(data) {
        var flightData = [];
        //Check if departure flight is elgible
        for (var i=0; i<data.flights.length; i++) {
          var departureDate = new Date(data.flights[i].departureDate);

          if(data.flights[i].fromAirportCode === filters.airports.from.code
              && data.flights[i].toAirportCode === filters.airports.to.code
              && departureDate.sameDay(filters.departure.date)
              && filters.passengerCount <= data.flights[i].remainingTickets) {
            flightData.push({
              departureFlight: getConvertedObj(data.flights[i])
            });
          }
        }

        //Check if return flight is eligible
        if(flightData.length > 0) {
          for (var i=0; i<data.flights.length; i++) {
            var departureDate = new Date(data.flights[i].departureDate);

            if(data.flights[i].toAirportCode === filters.airports.from.code
              && data.flights[i].fromAirportCode === filters.airports.to.code
              && departureDate.sameDay(filters.return.date)
              && filters.passengerCount <= data.flights[i].remainingTickets) {
              for(var j=0; j < flightData.length; j++) {
                flightData[j].returnFlight = getConvertedObj(data.flights[i]);
              }
            }
          }
        }

        callbackFunc(flightData);
      };

      return $http.get('data/flights.json').success(successCallback);
    }

    function getConvertedObj (flight) {
      flight.departureDate = new Date(flight.departureDate);
      flight.arrivalDate = new Date(flight.arrivalDate);
      return flight;
    }

    return {
      getFromAirportList: getFromAirportList,
      getToAirportList: getToAirportList,
      searchFlights: searchFlights
    };
  }
})();
