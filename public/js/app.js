'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute','ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    when('/calendar', {
      templateUrl: 'partials/calendar',
      controller: 'CalendarCtrl'
    }).
    when('/signup', {
      templateUrl: 'partials/signup'
    }).
    when('/login', {
      templateUrl: 'partials/login'
    }).    
    when('/error', {
      templateUrl: '/error'      
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);  
}).
config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}).
run(function($http,AuthenticationService) {
  

});
