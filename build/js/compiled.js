(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app;

app = angular.module('freecycleApp', ['ngRoute', 'ngSanitize', 'angular-click-outside', 'angularjs-dropdown-multiselect']);

module.exports = app;


},{}],2:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('HomeController', function($scope, $filter, dataFactory) {
    var self;
    self = this;
    self.allProducts = [];
    self.selectedAreas = [];
    self.areas = [];
    self.selectStartDate = '';
    self.selectEndDate = '';
    self.areasTexts = {
      buttonDefaultText: 'Select areas'
    };
    self.areasSettings = {
      enableSearch: true,
      scrollableHeight: '300px',
      scrollable: true,
      externalIdProp: ''
    };
    self.getDate = function(ev, format) {
      var date, input;
      input = $(ev.currentTarget).find('input');
      date = $filter('date')(ev.date, format);
      return date;
    };
    self.init = function() {
      var endDate, startDate;
      dataFactory.getAreas().success(function(areas) {
        return self.areas = areas;
      });
      startDate = $('.date.start').datepicker({
        enableOnReadonly: true,
        format: 'dd/mm/yyyy',
        endDate: Date(Date.now()),
        immediateUpdates: true,
        autoclose: true
      }).on('changeDate', function(ev) {
        endDate.datepicker("setStartDate", self.getDate(ev, "dd/MM/yyyy"));
        return self.selectStartDate = self.getDate(ev, "yyyy-MM-dd");
      });
      return endDate = $('.date.end').datepicker({
        enableOnReadonly: true,
        format: 'dd/mm/yyyy',
        endDate: Date(Date.now()),
        immediateUpdates: true,
        autoclose: true
      }).on('changeDate', function(ev) {
        startDate.datepicker("setEndDate", self.getDate(ev, "dd/MM/yyyy"));
        return self.selectEndDate = self.getDate(ev, "yyyy-MM-dd");
      });
    };
    self.getProducts = function() {
      return dataFactory.getAreas().then(function(areas) {
        return self.areas = areas;
      }, function(err) {
        alert(err);
      });
    };
    self.fetchAllProducts = function() {
      return dataFactory.getProducts(self.selectedAreas, self.selectStartDate, self.selectEndDate).then(function(products) {
        return self.allProducts = products.data;
      }, function(err) {
        alert(err);
      });
    };
    return angular.element(document).ready(function() {
      return self.init();
    });
  });
};


},{}],3:[function(require,module,exports){
var app;

app = require('app');

require("routes")(app);

require("services/data")(app);

require("controllers/home/index")(app);


},{"app":1,"controllers/home/index":2,"routes":4,"services/data":5}],4:[function(require,module,exports){
module.exports = function(app) {
  return app.config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      return $routeProvider.when('/', {
        templateUrl: 'views/home/index.html'
      });
    }
  ]);
};


},{}],5:[function(require,module,exports){
module.exports = function(app) {
  return app.factory('dataFactory', [
    '$http', '$q', '$location', function($http, $q, $location) {
      var apiUrl, dataFactory;
      apiUrl = '/api';
      dataFactory = {};
      dataFactory.getAreas = function() {
        return $http.get('./mocks/areas.json');
      };
      dataFactory.getProducts = function(area, start_date, end_date) {
        var deferred, req;
        deferred = $q.defer();
        req = {
          method: 'POST',
          url: apiUrl + '/products',
          data: {
            area: area,
            date_start: start_date,
            date_end: end_date
          }
        };
        $http(req).then((function(products) {
          return deferred.resolve(products);
        }), function(err) {
          return deferred.reject(err.data);
        });
        return deferred.promise;
      };
      return dataFactory;
    }
  ]);
};


},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmNvZmZlZSIsImFwcC9jb250cm9sbGVycy9ob21lL2luZGV4LmNvZmZlZSIsImFwcC9tYWluLmNvZmZlZSIsImFwcC9yb3V0ZXMuY29mZmVlIiwiYXBwL3NlcnZpY2VzL2RhdGEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLENBQUUsU0FBRixFQUFhLFlBQWIsRUFBMkIsdUJBQTNCLEVBQW9ELGdDQUFwRCxDQUEvQjs7QUFDTixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0RqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQ7U0FFaEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFdBQWxCO0FBTWhDLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFDUCxJQUFJLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFJLENBQUMsYUFBTCxHQUFxQjtJQUNyQixJQUFJLENBQUMsS0FBTCxHQUFhO0lBQ2IsSUFBSSxDQUFDLGVBQUwsR0FBdUI7SUFDdkIsSUFBSSxDQUFDLGFBQUwsR0FBcUI7SUFFckIsSUFBSSxDQUFDLFVBQUwsR0FDQztNQUFBLGlCQUFBLEVBQW1CLGNBQW5COztJQUVELElBQUksQ0FBQyxhQUFMLEdBQ0M7TUFBQSxZQUFBLEVBQWMsSUFBZDtNQUNBLGdCQUFBLEVBQWtCLE9BRGxCO01BRUEsVUFBQSxFQUFZLElBRlo7TUFHQSxjQUFBLEVBQWdCLEVBSGhCOztJQWdCRCxJQUFJLENBQUMsT0FBTCxHQUFlLFNBQUMsRUFBRCxFQUFLLE1BQUw7QUFDZCxVQUFBO01BQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxFQUFFLENBQUMsYUFBTCxDQUFtQixDQUFDLElBQXBCLENBQXlCLE9BQXpC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cmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnJlZWN5Y2xlQXBwJywgWyAnbmdSb3V0ZScsICduZ1Nhbml0aXplJywgJ2FuZ3VsYXItY2xpY2stb3V0c2lkZScsICdhbmd1bGFyanMtZHJvcGRvd24tbXVsdGlzZWxlY3QnIF0pXG5tb2R1bGUuZXhwb3J0cyA9IGFwcCIsIm1vZHVsZS5leHBvcnRzID0gKGFwcCkgLT5cblxuXHRhcHAuY29udHJvbGxlciAnSG9tZUNvbnRyb2xsZXInLCAoJHNjb3BlLCAkZmlsdGVyLCBkYXRhRmFjdG9yeSkgLT5cblxuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQjIEluaXRpYWxcblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRzZWxmID0gdGhpc1xuXHRcdHNlbGYuYWxsUHJvZHVjdHMgPSBbXVxuXHRcdHNlbGYuc2VsZWN0ZWRBcmVhcyA9IFtdXG5cdFx0c2VsZi5hcmVhcyA9IFtdXG5cdFx0c2VsZi5zZWxlY3RTdGFydERhdGUgPSAnJ1xuXHRcdHNlbGYuc2VsZWN0RW5kRGF0ZSA9ICcnXG5cblx0XHRzZWxmLmFyZWFzVGV4dHMgPVxuXHRcdFx0YnV0dG9uRGVmYXVsdFRleHQ6ICdTZWxlY3QgYXJlYXMnXG5cblx0XHRzZWxmLmFyZWFzU2V0dGluZ3MgPVxuXHRcdFx0ZW5hYmxlU2VhcmNoOiB0cnVlXG5cdFx0XHRzY3JvbGxhYmxlSGVpZ2h0OiAnMzAwcHgnXG5cdFx0XHRzY3JvbGxhYmxlOiB0cnVlXG5cdFx0XHRleHRlcm5hbElkUHJvcDogJydcblxuXG5cblxuXG5cblxuXG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdCMgRGF0YSBGdW5jdGlvbnNcblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRzZWxmLmdldERhdGUgPSAoZXYsIGZvcm1hdCkgLT5cblx0XHRcdGlucHV0ID0gJChldi5jdXJyZW50VGFyZ2V0KS5maW5kKCdpbnB1dCcpXG5cdFx0XHRkYXRlID0gJGZpbHRlcignZGF0ZScpKGV2LmRhdGUsIGZvcm1hdClcblx0XHRcdHJldHVybiBkYXRlXG5cblxuXHRcdHNlbGYuaW5pdCA9ICgpIC0+XG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRBcmVhcygpLnN1Y2Nlc3MgKGFyZWFzKSAtPlxuXHRcdFx0XHRzZWxmLmFyZWFzID0gYXJlYXNcblxuXHRcdFx0c3RhcnREYXRlID0gJCgnLmRhdGUuc3RhcnQnKS5kYXRlcGlja2VyKFxuXHRcdFx0XHRlbmFibGVPblJlYWRvbmx5OiB0cnVlXG5cdFx0XHRcdGZvcm1hdDogJ2RkL21tL3l5eXknXG5cdFx0XHRcdGVuZERhdGU6IERhdGUoRGF0ZS5ub3coKSlcblx0XHRcdFx0aW1tZWRpYXRlVXBkYXRlczogdHJ1ZVxuXHRcdFx0XHRhdXRvY2xvc2U6IHRydWVcblx0XHRcdCkub24gJ2NoYW5nZURhdGUnLCAoZXYpIC0+XG5cdFx0XHRcdGVuZERhdGUuZGF0ZXBpY2tlcihcInNldFN0YXJ0RGF0ZVwiLCBzZWxmLmdldERhdGUoZXYsIFwiZGQvTU0veXl5eVwiKSlcblx0XHRcdFx0c2VsZi5zZWxlY3RTdGFydERhdGUgPSBzZWxmLmdldERhdGUoZXYsIFwieXl5eS1NTS1kZFwiKVxuXG5cdFx0XHRlbmREYXRlID0gJCgnLmRhdGUuZW5kJykuZGF0ZXBpY2tlcihcblx0XHRcdFx0ZW5hYmxlT25SZWFkb25seTogdHJ1ZVxuXHRcdFx0XHRmb3JtYXQ6ICdkZC9tbS95eXl5J1xuXHRcdFx0XHRlbmREYXRlOiBEYXRlKERhdGUubm93KCkpXG5cdFx0XHRcdGltbWVkaWF0ZVVwZGF0ZXM6IHRydWVcblx0XHRcdFx0YXV0b2Nsb3NlOiB0cnVlXG5cdFx0XHQpLm9uICdjaGFuZ2VEYXRlJywgKGV2KSAtPlxuXHRcdFx0XHRzdGFydERhdGUuZGF0ZXBpY2tlcihcInNldEVuZERhdGVcIiwgc2VsZi5nZXREYXRlKGV2LCBcImRkL01NL3l5eXlcIikpXG5cdFx0XHRcdHNlbGYuc2VsZWN0RW5kRGF0ZSA9IHNlbGYuZ2V0RGF0ZShldiwgXCJ5eXl5LU1NLWRkXCIpXG5cblx0XHQjIEdldCBwcm9kdWN0c1xuXHRcdHNlbGYuZ2V0UHJvZHVjdHMgPSAoKSAtPlxuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0QXJlYXMoKS50aGVuKCAoYXJlYXMpIC0+XG5cdFx0XHRcdHNlbGYuYXJlYXMgPSBhcmVhc1xuXHRcdFx0LCAoZXJyKSAtPlxuXHRcdFx0XHRhbGVydCBlcnJcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQpXG5cblx0XHRzZWxmLmZldGNoQWxsUHJvZHVjdHMgPSAoKSAtPlxuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0UHJvZHVjdHMoc2VsZi5zZWxlY3RlZEFyZWFzLCBzZWxmLnNlbGVjdFN0YXJ0RGF0ZSwgc2VsZi5zZWxlY3RFbmREYXRlKS50aGVuKCAocHJvZHVjdHMpIC0+XG5cdFx0XHRcdHNlbGYuYWxsUHJvZHVjdHMgPSBwcm9kdWN0cy5kYXRhXG5cdFx0XHQsIChlcnIpIC0+XG5cdFx0XHRcdGFsZXJ0IGVyclxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblxuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQjIFN0YXJ0XG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeSggKCkgLT5cblx0XHRcdHNlbGYuaW5pdCgpXG5cdFx0KVxuXHQiLCJhcHAgPSByZXF1aXJlICdhcHAnXG5cbnJlcXVpcmUoXCJyb3V0ZXNcIikoYXBwKVxucmVxdWlyZShcInNlcnZpY2VzL2RhdGFcIikoYXBwKVxucmVxdWlyZShcImNvbnRyb2xsZXJzL2hvbWUvaW5kZXhcIikoYXBwKVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoYXBwKSAtPlxuXG5cdGFwcC5jb25maWcgW1xuXHRcdCckcm91dGVQcm92aWRlcicsJyRsb2NhdGlvblByb3ZpZGVyJ1xuXHRcdCgkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG5cblx0XHRcdCMgSFRNTDUgSGlzdG9yeSBBUElcblx0XHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuXHRcdFx0JHJvdXRlUHJvdmlkZXJcblx0XHRcdFx0LndoZW4oJy8nLFxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS9pbmRleC5odG1sJ1xuXHRcdFx0XHQpXG5cblx0XSIsIm1vZHVsZS5leHBvcnRzID0gKGFwcCkgLT5cblxuXHRhcHAuZmFjdG9yeSAnZGF0YUZhY3RvcnknLCBbXG5cdFx0JyRodHRwJywgJyRxJywgJyRsb2NhdGlvbidcblx0XHQoJGh0dHAsICRxLCAkbG9jYXRpb24pIC0+XG5cdFx0XHRhcGlVcmwgPSAnL2FwaSdcblx0XHRcdGRhdGFGYWN0b3J5ID0ge31cblxuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0QXJlYXMgPSAoKSAtPlxuXHRcdFx0XHQjICRodHRwLmdldCBhcGlVcmwgKyAnL2FyZWFzJ1xuXHRcdFx0XHRcblx0XHRcdFx0JGh0dHAuZ2V0KCcuL21vY2tzL2FyZWFzLmpzb24nKVxuXG5cblxuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0UHJvZHVjdHMgPSAoYXJlYSwgc3RhcnRfZGF0ZSwgZW5kX2RhdGUpIC0+XG5cdFx0XHRcdGRlZmVycmVkID0gJHEuZGVmZXIoKVxuXG5cdFx0XHRcdHJlcSA9XG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCdcblx0XHRcdFx0XHR1cmw6IGFwaVVybCArICcvcHJvZHVjdHMnXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdGFyZWE6IGFyZWFcblx0XHRcdFx0XHRcdGRhdGVfc3RhcnQ6IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdGRhdGVfZW5kOiBlbmRfZGF0ZVxuXG5cdFx0XHRcdCRodHRwKHJlcSkudGhlbiAoIChwcm9kdWN0cykgLT5cblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlIHByb2R1Y3RzXG5cdFx0XHRcdCksIChlcnIpIC0+XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0IGVyci5kYXRhXG5cblx0XHRcdFx0ZGVmZXJyZWQucHJvbWlzZVxuXG5cblx0XHRcdGRhdGFGYWN0b3J5XG5cdFx0XVxuIl19
