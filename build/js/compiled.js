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
    self.hideAdvanced = true;
    self.selectedAreas = [];
    self.areas = [];
    self.selectStartDate = '';
    self.selectEndDate = '';
    self.isLoadingVisible = false;
    self.loadingMessage = '';
    self.isErrorVisible = false;
    self.errorMessage = '';
    self.modalImage = '';
    self.areasTexts = {
      buttonDefaultText: 'Select areas'
    };
    self.areasSettings = {
      enableSearch: true,
      scrollableHeight: '200px',
      scrollable: true,
      externalIdProp: '',
      selectionLimit: 2
    };
    self.getDate = function(ev, format) {
      var date, input;
      input = $(ev.currentTarget).find('input');
      date = $filter('date')(ev.date, format);
      return date;
    };
    self.showLoading = function(message) {
      self.isLoadingVisible = true;
      return self.loadingMessage = message;
    };
    self.hideLoading = function() {
      return self.isLoadingVisible = false;
    };
    self.showError = function(error) {
      self.isErrorVisible = true;
      return self.errorMessage = error;
    };
    self.clickFn = function($event) {
      var bg;
      bg = $($event.currentTarget).css('background-image');
      bg = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
      if (bg.indexOf('freecycle.org') > -1) {
        $('#imagepreview').attr('src', bg);
        return $('#imagemodal').modal('show');
      }
    };
    self.init = function() {
      var endDate, startDate;
      dataFactory.getAreas().then(function(areas) {
        return self.areas = areas.data;
      });
      startDate = $('.date.start').datepicker({
        enableOnReadonly: true,
        format: 'dd/mm/yyyy',
        endDate: Date(Date.now()),
        immediateUpdates: true,
        autoclose: true,
        defaultDate: ''
      }).on('changeDate', function(ev) {
        endDate.datepicker("setStartDate", self.getDate(ev, "dd/MM/yyyy"));
        return self.selectStartDate = self.getDate(ev, "yyyy-MM-dd");
      });
      endDate = $('.date.end').datepicker({
        enableOnReadonly: true,
        format: 'dd/mm/yyyy',
        endDate: Date(Date.now()),
        immediateUpdates: true,
        autoclose: true,
        defaultDate: ''
      }).on('changeDate', function(ev) {
        startDate.datepicker("setEndDate", self.getDate(ev, "dd/MM/yyyy"));
        return self.selectEndDate = self.getDate(ev, "yyyy-MM-dd");
      });
      $('input.start-date').blur(function() {
        if (!$(this).val()) {
          return self.selectStartDate = '';
        }
      });
      return $('input.end-date').blur(function() {
        if (!$(this).val()) {
          return self.selectEndDate = '';
        }
      });
    };
    self.getProducts = function() {
      self.showLoading('Fetching areas');
      return dataFactory.getAreas().then(function(areas) {
        self.hideLoading();
        return self.areas = areas;
      }, function(err) {
        self.showError(err);
      });
    };
    self.fetchAllProducts = function() {
      self.isErrorVisible = false;
      self.showLoading('Fetching products');
      return dataFactory.getProducts(self.selectedAreas, self.selectStartDate, self.selectEndDate).then(function(products) {
        self.hideLoading();
        return self.allProducts = products.data;
      }, function(err) {
        self.showError(err);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmNvZmZlZSIsImFwcC9jb250cm9sbGVycy9ob21lL2luZGV4LmNvZmZlZSIsImFwcC9tYWluLmNvZmZlZSIsImFwcC9yb3V0ZXMuY29mZmVlIiwiYXBwL3NlcnZpY2VzL2RhdGEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLENBQUUsU0FBRixFQUFhLFlBQWIsRUFBMkIsdUJBQTNCLEVBQW9ELGdDQUFwRCxDQUEvQjs7QUFDTixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0RqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQ7U0FFaEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFdBQWxCO0FBTWhDLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFDUCxJQUFJLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFJLENBQUMsWUFBTCxHQUFvQjtJQUNwQixJQUFJLENBQUMsYUFBTCxHQUFxQjtJQUNyQixJQUFJLENBQUMsS0FBTCxHQUFhO0lBQ2IsSUFBSSxDQUFDLGVBQUwsR0FBdUI7SUFDdkIsSUFBSSxDQUFDLGFBQUwsR0FBcUI7SUFFckIsSUFBSSxDQUFDLGdCQUFMLEdBQXdCO0lBQ3hCLElBQUksQ0FBQyxjQUFMLEdBQXNCO0lBRXRCLElBQUksQ0FBQyxjQUFMLEdBQXNCO0lBQ3RCLElBQUksQ0FBQyxZQUFMLEdBQW9CO0lBRXBCLElBQUksQ0FBQyxVQUFMLEdBQWtCO0lBRWxCLElBQUksQ0FBQyxVQUFMLEdBQ0M7TUFBQSxpQkFBQSxFQUFtQixjQUFuQjs7SUFFRCxJQUFJLENBQUMsYUFBTCxHQUNDO01BQUEsWUFBQSxFQUFjLElBQWQ7TUFDQSxnQkFBQSxFQUFrQixPQURsQjtNQUVB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RUFBbUIsUUFBbkI7QUFDekIsWUFBQTtRQUFBLFFBQUEsR0FBVyxFQUFFLENBQUMsS0FBSCxDQUFBO1FBRVgsR0FBQSxHQUNDO1VBQUEsTUFBQSxFQUFRLE1BQVI7VUFDQSxHQUFBLEVBQUssTUFBQSxHQUFTLFdBRGQ7VUFFQSxJQUFBLEVBQ0M7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUNBLFVBQUEsRUFBWSxVQURaO1lBRUEsUUFBQSxFQUFVLFFBRlY7V0FIRDs7UUFPRCxLQUFBLENBQU0sR0FBTixDQUFVLENBQUMsSUFBWCxDQUFnQixDQUFFLFNBQUMsUUFBRDtpQkFDakIsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsUUFBakI7UUFEaUIsQ0FBRixDQUFoQixFQUVHLFNBQUMsR0FBRDtpQkFDRixRQUFRLENBQUMsTUFBVCxDQUFnQixHQUFHLENBQUMsSUFBcEI7UUFERSxDQUZIO2VBS0EsUUFBUSxDQUFDO01BaEJnQjthQW1CMUI7SUE1QkQsQ0FGMEI7R0FBM0I7QUFGZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZyZWVjeWNsZUFwcCcsIFsgJ25nUm91dGUnLCAnbmdTYW5pdGl6ZScsICdhbmd1bGFyLWNsaWNrLW91dHNpZGUnLCAnYW5ndWxhcmpzLWRyb3Bkb3duLW11bHRpc2VsZWN0JyBdKVxubW9kdWxlLmV4cG9ydHMgPSBhcHAiLCJtb2R1bGUuZXhwb3J0cyA9IChhcHApIC0+XG5cblx0YXBwLmNvbnRyb2xsZXIgJ0hvbWVDb250cm9sbGVyJywgKCRzY29wZSwgJGZpbHRlciwgZGF0YUZhY3RvcnkpIC0+XG5cblx0XHQjLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0IyBJbml0aWFsXG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0c2VsZiA9IHRoaXNcblx0XHRzZWxmLmFsbFByb2R1Y3RzID0gW11cblx0XHRzZWxmLmhpZGVBZHZhbmNlZCA9IHRydWVcblx0XHRzZWxmLnNlbGVjdGVkQXJlYXMgPSBbXVxuXHRcdHNlbGYuYXJlYXMgPSBbXVxuXHRcdHNlbGYuc2VsZWN0U3RhcnREYXRlID0gJydcblx0XHRzZWxmLnNlbGVjdEVuZERhdGUgPSAnJ1xuXG5cdFx0c2VsZi5pc0xvYWRpbmdWaXNpYmxlID0gZmFsc2Vcblx0XHRzZWxmLmxvYWRpbmdNZXNzYWdlID0gJydcblxuXHRcdHNlbGYuaXNFcnJvclZpc2libGUgPSBmYWxzZVxuXHRcdHNlbGYuZXJyb3JNZXNzYWdlID0gJydcblxuXHRcdHNlbGYubW9kYWxJbWFnZSA9ICcnXG5cblx0XHRzZWxmLmFyZWFzVGV4dHMgPVxuXHRcdFx0YnV0dG9uRGVmYXVsdFRleHQ6ICdTZWxlY3QgYXJlYXMnXG5cblx0XHRzZWxmLmFyZWFzU2V0dGluZ3MgPVxuXHRcdFx0ZW5hYmxlU2VhcmNoOiB0cnVlXG5cdFx0XHRzY3JvbGxhYmxlSGVpZ2h0OiAnMjAwcHgnXG5cdFx0XHRzY3JvbGxhYmxlOiB0cnVlXG5cdFx0XHRleHRlcm5hbElkUHJvcDogJydcblx0XHRcdHNlbGVjdGlvbkxpbWl0OiAyXG5cblxuXG5cblxuXG5cblxuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQjIEZ1bmN0aW9uc1xuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHNlbGYuZ2V0RGF0ZSA9IChldiwgZm9ybWF0KSAtPlxuXHRcdFx0aW5wdXQgPSAkKGV2LmN1cnJlbnRUYXJnZXQpLmZpbmQoJ2lucHV0Jylcblx0XHRcdGRhdGUgPSAkZmlsdGVyKCdkYXRlJykoZXYuZGF0ZSwgZm9ybWF0KVxuXHRcdFx0cmV0dXJuIGRhdGVcblxuXHRcdHNlbGYuc2hvd0xvYWRpbmcgPSAobWVzc2FnZSkgLT5cblx0XHRcdHNlbGYuaXNMb2FkaW5nVmlzaWJsZSA9IHRydWVcblx0XHRcdHNlbGYubG9hZGluZ01lc3NhZ2UgPSBtZXNzYWdlXG5cblx0XHRzZWxmLmhpZGVMb2FkaW5nID0gKCkgLT5cblx0XHRcdHNlbGYuaXNMb2FkaW5nVmlzaWJsZSA9IGZhbHNlXG5cblx0XHRzZWxmLnNob3dFcnJvciA9IChlcnJvcikgLT5cblx0XHRcdHNlbGYuaXNFcnJvclZpc2libGUgPSB0cnVlXG5cdFx0XHRzZWxmLmVycm9yTWVzc2FnZSA9IGVycm9yXG5cblx0XHRzZWxmLmNsaWNrRm4gPSAoJGV2ZW50KSAtPlxuXHRcdFx0YmcgPSAkKCRldmVudC5jdXJyZW50VGFyZ2V0KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKVxuXHRcdFx0YmcgPSBiZy5yZXBsYWNlKC8uKlxccz91cmxcXChbXFwnXFxcIl0/LywgJycpLnJlcGxhY2UoL1tcXCdcXFwiXT9cXCkuKi8sICcnKVxuXG5cdFx0XHRpZiBiZy5pbmRleE9mKCdmcmVlY3ljbGUub3JnJykgPiAtMVxuXHRcdFx0XHQkKCcjaW1hZ2VwcmV2aWV3JykuYXR0ciAnc3JjJywgYmdcblx0XHRcdFx0JCgnI2ltYWdlbW9kYWwnKS5tb2RhbCAnc2hvdydcblxuXHRcdHNlbGYuaW5pdCA9ICgpIC0+XG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRBcmVhcygpLnRoZW4gKGFyZWFzKSAtPlxuXHRcdFx0XHRzZWxmLmFyZWFzID0gYXJlYXMuZGF0YVxuXG5cdFx0XHRzdGFydERhdGUgPSAkKCcuZGF0ZS5zdGFydCcpLmRhdGVwaWNrZXIoXG5cdFx0XHRcdGVuYWJsZU9uUmVhZG9ubHk6IHRydWVcblx0XHRcdFx0Zm9ybWF0OiAnZGQvbW0veXl5eSdcblx0XHRcdFx0ZW5kRGF0ZTogRGF0ZShEYXRlLm5vdygpKVxuXHRcdFx0XHRpbW1lZGlhdGVVcGRhdGVzOiB0cnVlXG5cdFx0XHRcdGF1dG9jbG9zZTogdHJ1ZVxuXHRcdFx0XHRkZWZhdWx0RGF0ZTogJydcblx0XHRcdCkub24gJ2NoYW5nZURhdGUnLCAoZXYpIC0+XG5cdFx0XHRcdGVuZERhdGUuZGF0ZXBpY2tlcihcInNldFN0YXJ0RGF0ZVwiLCBzZWxmLmdldERhdGUoZXYsIFwiZGQvTU0veXl5eVwiKSlcblx0XHRcdFx0c2VsZi5zZWxlY3RTdGFydERhdGUgPSBzZWxmLmdldERhdGUoZXYsIFwieXl5eS1NTS1kZFwiKVxuXG5cdFx0XHRlbmREYXRlID0gJCgnLmRhdGUuZW5kJykuZGF0ZXBpY2tlcihcblx0XHRcdFx0ZW5hYmxlT25SZWFkb25seTogdHJ1ZVxuXHRcdFx0XHRmb3JtYXQ6ICdkZC9tbS95eXl5J1xuXHRcdFx0XHRlbmREYXRlOiBEYXRlKERhdGUubm93KCkpXG5cdFx0XHRcdGltbWVkaWF0ZVVwZGF0ZXM6IHRydWVcblx0XHRcdFx0YXV0b2Nsb3NlOiB0cnVlXG5cdFx0XHRcdGRlZmF1bHREYXRlOiAnJ1xuXHRcdFx0KS5vbiAnY2hhbmdlRGF0ZScsIChldikgLT5cblx0XHRcdFx0c3RhcnREYXRlLmRhdGVwaWNrZXIoXCJzZXRFbmREYXRlXCIsIHNlbGYuZ2V0RGF0ZShldiwgXCJkZC9NTS95eXl5XCIpKVxuXHRcdFx0XHRzZWxmLnNlbGVjdEVuZERhdGUgPSBzZWxmLmdldERhdGUoZXYsIFwieXl5eS1NTS1kZFwiKVxuXG5cdFx0XHQkKCdpbnB1dC5zdGFydC1kYXRlJykuYmx1ciAoKSAtPlxuXHRcdFx0XHRpZiAhJCh0aGlzKS52YWwoKVxuXHRcdFx0XHRcdHNlbGYuc2VsZWN0U3RhcnREYXRlID0gJydcblxuXHRcdFx0JCgnaW5wdXQuZW5kLWRhdGUnKS5ibHVyICgpIC0+XG5cdFx0XHRcdGlmICEkKHRoaXMpLnZhbCgpXG5cdFx0XHRcdFx0c2VsZi5zZWxlY3RFbmREYXRlID0gJydcblxuXG5cdFx0IyBHZXQgcHJvZHVjdHNcblx0XHRzZWxmLmdldFByb2R1Y3RzID0gKCkgLT5cblx0XHRcdHNlbGYuc2hvd0xvYWRpbmcgJ0ZldGNoaW5nIGFyZWFzJ1xuXHRcdFx0ZGF0YUZhY3RvcnkuZ2V0QXJlYXMoKS50aGVuKCAoYXJlYXMpIC0+XG5cdFx0XHRcdHNlbGYuaGlkZUxvYWRpbmcoKVxuXHRcdFx0XHRzZWxmLmFyZWFzID0gYXJlYXNcblx0XHRcdCwgKGVycikgLT5cblx0XHRcdFx0c2VsZi5zaG93RXJyb3IgZXJyXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0KVxuXG5cdFx0c2VsZi5mZXRjaEFsbFByb2R1Y3RzID0gKCkgLT5cblx0XHRcdHNlbGYuaXNFcnJvclZpc2libGUgPSBmYWxzZVxuXHRcdFx0c2VsZi5zaG93TG9hZGluZyAnRmV0Y2hpbmcgcHJvZHVjdHMnXG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRQcm9kdWN0cyhzZWxmLnNlbGVjdGVkQXJlYXMsIHNlbGYuc2VsZWN0U3RhcnREYXRlLCBzZWxmLnNlbGVjdEVuZERhdGUpLnRoZW4oIChwcm9kdWN0cykgLT5cblx0XHRcdFx0c2VsZi5oaWRlTG9hZGluZygpXG5cdFx0XHRcdHNlbGYuYWxsUHJvZHVjdHMgPSBwcm9kdWN0cy5kYXRhXG5cdFx0XHQsIChlcnIpIC0+XG5cdFx0XHRcdHNlbGYuc2hvd0Vycm9yIGVyclxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdClcblxuXHRcdCMvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHQjIFN0YXJ0XG5cdFx0Iy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0YW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeSggKCkgLT5cblx0XHRcdHNlbGYuaW5pdCgpXG5cdFx0KVxuIiwiYXBwID0gcmVxdWlyZSAnYXBwJ1xuXG5yZXF1aXJlKFwicm91dGVzXCIpKGFwcClcbnJlcXVpcmUoXCJzZXJ2aWNlcy9kYXRhXCIpKGFwcClcbnJlcXVpcmUoXCJjb250cm9sbGVycy9ob21lL2luZGV4XCIpKGFwcClcbiIsIm1vZHVsZS5leHBvcnRzID0gKGFwcCkgLT5cblxuXHRhcHAuY29uZmlnIFtcblx0XHQnJHJvdXRlUHJvdmlkZXInLCckbG9jYXRpb25Qcm92aWRlcidcblx0XHQoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSAtPlxuXG5cdFx0XHQjIEhUTUw1IEhpc3RvcnkgQVBJXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG5cblx0XHRcdCRyb3V0ZVByb3ZpZGVyXG5cdFx0XHRcdC53aGVuKCcvJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL2hvbWUvaW5kZXguaHRtbCdcblx0XHRcdFx0KVxuXG5cdF0iLCJtb2R1bGUuZXhwb3J0cyA9IChhcHApIC0+XG5cblx0YXBwLmZhY3RvcnkgJ2RhdGFGYWN0b3J5JywgW1xuXHRcdCckaHR0cCcsICckcScsICckbG9jYXRpb24nXG5cdFx0KCRodHRwLCAkcSwgJGxvY2F0aW9uKSAtPlxuXHRcdFx0YXBpVXJsID0gJy9hcGknXG5cdFx0XHRkYXRhRmFjdG9yeSA9IHt9XG5cblx0XHRcdGRhdGFGYWN0b3J5LmdldEFyZWFzID0gKCkgLT5cdFxuXHRcdFx0XHQkaHR0cC5nZXQoJy4vbW9ja3MvYXJlYXMuanNvbicpXG5cblxuXG5cdFx0XHRkYXRhRmFjdG9yeS5nZXRQcm9kdWN0cyA9IChhcmVhLCBzdGFydF9kYXRlLCBlbmRfZGF0ZSkgLT5cblx0XHRcdFx0ZGVmZXJyZWQgPSAkcS5kZWZlcigpXG5cblx0XHRcdFx0cmVxID1cblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJ1xuXHRcdFx0XHRcdHVybDogYXBpVXJsICsgJy9wcm9kdWN0cydcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0YXJlYTogYXJlYVxuXHRcdFx0XHRcdFx0ZGF0ZV9zdGFydDogc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0ZGF0ZV9lbmQ6IGVuZF9kYXRlXG5cblx0XHRcdFx0JGh0dHAocmVxKS50aGVuICggKHByb2R1Y3RzKSAtPlxuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUgcHJvZHVjdHNcblx0XHRcdFx0KSwgKGVycikgLT5cblx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QgZXJyLmRhdGFcblxuXHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlXG5cblxuXHRcdFx0ZGF0YUZhY3Rvcnlcblx0XHRdXG4iXX0=
