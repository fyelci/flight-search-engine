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
          return $http.get('data/flights.json').success(function(data) {
              var flightData = [];
              for (var i=0; i<data.flights.length; i++) {
                var departureDate = new Date(data.flights[i].departureDate);
                var arrivalDate = new Date(data.flights[i].arrivalDate);
                if(data.flights[i].fromAirportCode == filters.airports.from.code
                   && data.flights[i].toAirportCode == filters.airports.to.code
                   && departureDate.sameDay(filters.departure.date)
                   && filters.passengerCount <= data.flights[i].remainingTickets) {
                     flightData.push({
                       departureFlight: getConvertedObj(data.flights[i]),
                       returnFlight: getConvertedObj(data.flights[0])
                     });
                }
              }
            callbackFunc(flightData);
          });
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
