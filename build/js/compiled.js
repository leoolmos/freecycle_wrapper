(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app;

app = angular.module('freecycleApp', ['ngRoute', 'angular-click-outside', 'angularjs-dropdown-multiselect']);

module.exports = app;


},{}],2:[function(require,module,exports){
module.exports = function(app) {
  return app.controller('HomeController', function($scope, $filter, dataFactory) {
    var self;
    self = this;
    self.allProducts = [];
    self.selectedAreas = [];
    self.areas = [];
    self.areasTexts = {
      buttonDefaultText: 'Select areas'
    };
    self.areasSettings = {
      enableSearch: true,
      scrollableHeight: '300px',
      scrollable: true,
      externalIdProp: ''
    };
    self.init = function() {
      dataFactory.getAreas().success(function(areas) {
        return self.areas = areas;
      });
      return $('.date').datepicker({
        enableOnReadonly: true,
        format: 'dd/mm/yyyy',
        endDate: Date(Date.now()),
        immediateUpdates: true,
        autoclose: true
      }).on('changeDate', function(ev) {
        var date, input;
        input = $(ev.currentTarget).find('input');
        date = $filter('date')(ev.date, "yyyy-MM-dd");
        if (input.hasClass('start-date')) {
          self.selectStartDate = date;
        }
        if (input.hasClass('end-date')) {
          return self.selectEndDate = date;
        }
      });
    };
    self.getProducts = function() {
      return dataFactory.getAreas().then(function(areas) {
        return self.areas = areas;
      }, function(err) {
        alert(err);
      });
    };
    self.getProducts = function() {
      return dataFactory.getProducts(area, startDate, endDate).then(function(products) {
        return self.allProducts = products;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmNvZmZlZSIsImFwcC9jb250cm9sbGVycy9ob21lL2luZGV4LmNvZmZlZSIsImFwcC9tYWluLmNvZmZlZSIsImFwcC9yb3V0ZXMuY29mZmVlIiwiYXBwL3NlcnZpY2VzL2RhdGEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLENBQUUsU0FBRixFQUFhLHVCQUFiLEVBQXNDLGdDQUF0QyxDQUEvQjs7QUFDTixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0RqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQ7U0FFaEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFdBQWxCO0FBTWhDLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFDUCxJQUFJLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFJLENBQUMsYUFBTCxHQUFxQjtJQUNyQixJQUFJLENBQUMsS0FBTCxHQUFhO0lBRWIsSUFBSSxDQUFDLFVBQUwsR0FDQztNQUFBLGlCQUFBLEVBQW1CLGNBQW5COztJQUVELElBQUksQ0FBQyxhQUFMLEdBQ0M7TUFBQSxZQUFBLEVBQWMsSUFBZDtNQUNBLGdCQUFBLEVBQWtCLE9BRGxCO01BRUEsVUFBQSxFQUFZLElBRlo7TUFHQSxjQUFBLEVBQWdCLEVBSGhCOztJQWdCRCxJQUFJLENBQUMsSUFBTCxHQUFZLFNBQUE7TUFDWCxXQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsU0FBQyxLQUFEO2VBQzlCLElBQUksQ0FBQyxLQUFMLEdBQWE7TUFEaUIsQ0FBL0I7YUFHQSxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsVUFBWCxDQUNDO1FBQUEsZ0JBQUEsRUFBa0IsSUFBbEI7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QURkO1VBRUEsSUFBQSxFQUNDO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxVQUFBLEVBQVksVUFEWjtZQUVBLFFBQUEsRUFBVSxRQUZWO1dBSEQ7O1FBT0QsS0FBQSxDQUFNLEdBQU4sQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsQ0FBRSxTQUFDLFFBQUQ7aUJBQ2pCLFFBQVEsQ0FBQyxPQUFULENBQWlCLFFBQWpCO1FBRGlCLENBQUYsQ0FBaEIsRUFFRyxTQUFDLEdBQUQ7aUJBQ0YsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBRyxDQUFDLElBQXBCO1FBREUsQ0FGSDtlQUtBLFFBQVEsQ0FBQztNQWhCZ0I7YUFtQjFCO0lBOUJELENBRjBCO0dBQTNCO0FBRmdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmcmVlY3ljbGVBcHAnLCBbICduZ1JvdXRlJywgJ2FuZ3VsYXItY2xpY2stb3V0c2lkZScsICdhbmd1bGFyanMtZHJvcGRvd24tbXVsdGlzZWxlY3QnIF0pXG5tb2R1bGUuZXhwb3J0cyA9IGFwcCIsIm1vZHVsZS5leHBvcnRzID0gKGFwcCkgLT5cblxuXHRhcHAuY29udHJvbGxlciAnSG9tZUNvbnRyb2xsZXInLCAoJHNjb3BlLCAkZmlsdGVyLCBkYXRhRmFjdG9yeSkgLT5cblxuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQjIEluaXRpYWxcblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRzZWxmID0gdGhpc1xuXHRcdHNlbGYuYWxsUHJvZHVjdHMgPSBbXVxuXHRcdHNlbGYuc2VsZWN0ZWRBcmVhcyA9IFtdXG5cdFx0c2VsZi5hcmVhcyA9IFtdXG5cblx0XHRzZWxmLmFyZWFzVGV4dHMgPVxuXHRcdFx0YnV0dG9uRGVmYXVsdFRleHQ6ICdTZWxlY3QgYXJlYXMnXG5cblx0XHRzZWxmLmFyZWFzU2V0dGluZ3MgPVxuXHRcdFx0ZW5hYmxlU2VhcmNoOiB0cnVlXG5cdFx0XHRzY3JvbGxhYmxlSGVpZ2h0OiAnMzAwcHgnXG5cdFx0XHRzY3JvbGxhYmxlOiB0cnVlXG5cdFx0XHRleHRlcm5hbElkUHJvcDogJydcblxuXG5cblxuXG5cblxuXG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdCMgRGF0YSBGdW5jdGlvbnNcblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRzZWxmLmluaXQgPSAoKSAtPlxuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0QXJlYXMoKS5zdWNjZXNzIChhcmVhcykgLT5cblx0XHRcdFx0c2VsZi5hcmVhcyA9IGFyZWFzXG5cblx0XHRcdCQoJy5kYXRlJykuZGF0ZXBpY2tlcihcblx0XHRcdFx0ZW5hYmxlT25SZWFkb25seTogdHJ1ZVxuXHRcdFx0XHRmb3JtYXQ6ICdkZC9tbS95eXl5J1xuXHRcdFx0XHRlbmREYXRlOiBEYXRlKERhdGUubm93KCkpXG5cdFx0XHRcdGltbWVkaWF0ZVVwZGF0ZXM6IHRydWVcblx0XHRcdFx0YXV0b2Nsb3NlOiB0cnVlXG5cdFx0XHQpLm9uICdjaGFuZ2VEYXRlJywgKGV2KSAtPlxuXHRcdFx0XHRpbnB1dCA9ICQoZXYuY3VycmVudFRhcmdldCkuZmluZCgnaW5wdXQnKVxuXHRcdFx0XHRkYXRlID0gJGZpbHRlcignZGF0ZScpKGV2LmRhdGUsIFwieXl5eS1NTS1kZFwiKVxuXG5cdFx0XHRcdGlmIGlucHV0Lmhhc0NsYXNzKCdzdGFydC1kYXRlJylcblx0XHRcdFx0XHRzZWxmLnNlbGVjdFN0YXJ0RGF0ZSA9IGRhdGVcblx0XHRcdFx0aWYgaW5wdXQuaGFzQ2xhc3MoJ2VuZC1kYXRlJylcblx0XHRcdFx0XHRzZWxmLnNlbGVjdEVuZERhdGUgPSBkYXRlXG5cblxuXHRcdCMgR2V0IHByb2R1Y3RzXG5cdFx0c2VsZi5nZXRQcm9kdWN0cyA9ICgpIC0+XG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRBcmVhcygpLnRoZW4oIChhcmVhcykgLT5cblx0XHRcdFx0c2VsZi5hcmVhcyA9IGFyZWFzXG5cdFx0XHQsIChlcnIpIC0+XG5cdFx0XHRcdGFsZXJ0IGVyclxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblxuXHRcdCMgR2V0IHByb2R1Y3RzXG5cdFx0c2VsZi5nZXRQcm9kdWN0cyA9ICgpIC0+XG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRQcm9kdWN0cyhhcmVhLCBzdGFydERhdGUsIGVuZERhdGUpLnRoZW4oIChwcm9kdWN0cykgLT5cblx0XHRcdFx0c2VsZi5hbGxQcm9kdWN0cyA9IHByb2R1Y3RzXG5cdFx0XHQsIChlcnIpIC0+XG5cdFx0XHRcdGFsZXJ0IGVyclxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblxuXG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdCMgU3RhcnRcblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KCAoKSAtPlxuXHRcdFx0c2VsZi5pbml0KClcblx0XHQpXG5cdCIsImFwcCA9IHJlcXVpcmUgJ2FwcCdcblxucmVxdWlyZShcInJvdXRlc1wiKShhcHApXG5yZXF1aXJlKFwic2VydmljZXMvZGF0YVwiKShhcHApXG5yZXF1aXJlKFwiY29udHJvbGxlcnMvaG9tZS9pbmRleFwiKShhcHApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChhcHApIC0+XG5cblx0YXBwLmNvbmZpZyBbXG5cdFx0JyRyb3V0ZVByb3ZpZGVyJywnJGxvY2F0aW9uUHJvdmlkZXInXG5cdFx0KCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikgLT5cblxuXHRcdFx0IyBIVE1MNSBIaXN0b3J5IEFQSVxuXHRcdFx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG5cdFx0XHQkcm91dGVQcm92aWRlclxuXHRcdFx0XHQud2hlbignLycsXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lL2luZGV4Lmh0bWwnXG5cdFx0XHRcdClcblxuXHRdIiwibW9kdWxlLmV4cG9ydHMgPSAoYXBwKSAtPlxuXG5cdGFwcC5mYWN0b3J5ICdkYXRhRmFjdG9yeScsIFtcblx0XHQnJGh0dHAnLCAnJHEnLCAnJGxvY2F0aW9uJ1xuXHRcdCgkaHR0cCwgJHEsICRsb2NhdGlvbikgLT5cblx0XHRcdGFwaVVybCA9ICcvYXBpJ1xuXHRcdFx0ZGF0YUZhY3RvcnkgPSB7fVxuXG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRBcmVhcyA9ICgpIC0+XG5cdFx0XHRcdCMgJGh0dHAuZ2V0IGFwaVVybCArICcvYXJlYXMnXG5cdFx0XHRcdFxuXHRcdFx0XHQkaHR0cC5nZXQoJy4vbW9ja3MvYXJlYXMuanNvbicpXG5cblxuXG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRQcm9kdWN0cyA9IChhcmVhLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSkgLT5cblx0XHRcdFx0ZGVmZXJyZWQgPSAkcS5kZWZlcigpXG5cblx0XHRcdFx0cmVxID1cblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJ1xuXHRcdFx0XHRcdHVybDogYXBpVXJsICsgJy9wcm9kdWN0cydcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0YXJlYTogYXJlYVxuXHRcdFx0XHRcdFx0ZGF0ZV9zdGFydDogc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0ZGF0ZV9lbmQ6IGVuZF9kYXRlXG5cblx0XHRcdFx0JGh0dHAocmVxKS50aGVuICggKHByb2R1Y3RzKSAtPlxuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUgcHJvZHVjdHNcblx0XHRcdFx0KSwgKGVycikgLT5cblx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QgZXJyLmRhdGFcblxuXHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlXG5cblxuXHRcdFx0ZGF0YUZhY3Rvcnlcblx0XHRdXG4iXX0=
