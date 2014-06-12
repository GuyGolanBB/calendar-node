'use strict';

/* Services */

angular.module('myApp.services', ['ngResource']).
	factory('UserService', function($http,$templateCache,AuthenticationService) {
	    return {
	        login: function(data,callback) {
	        	$http.post('/login', {username: data.username, password: data.password}).then(function(data) {
	        		var details = data.data;
	        		AuthenticationService.login(details);
	        		callback(AuthenticationService.getDetails());
	        	});	            
	        },     
	        logout: function(callback) {  
	            $http.get('/logout').then(function(data){
	            	AuthenticationService.reset();
	            	$templateCache.removeAll();
            		callback(data);
	            });
	        },
	        signup: function(data,callback) {
	            $http.post('/signup', {
	                name: data.name,
	                username: data.username, 
	                password: data.password,
	                passwordConfirmation: data.passwordConfirmation 
	            }).then(function(data) {
	            	var details = data.data;
	        		AuthenticationService.login(details);
	        		callback(AuthenticationService.getDetails());
	            });
	        },
	        isAuthenticated: function(callback) {
			  $http.get('/user/isAuthenticated').then(function(data){
			        var details = data.data;
			        if (details) {
			          AuthenticationService.login(details);
			        }
	        		callback(AuthenticationService.getDetails());
			   	});
	        }
	    }
	}).
	factory('AuthenticationService', function($rootScope) {
        var auth = {
            name : '',
            username : '',
            isAuthenticated: false,
            isAdmin: false,
        },
        	reset = function(){
            auth.name = '';
            auth.username = '';
            auth.isAuthenticated = false;
            auth.isAdmin = false;	            
        },
        	login = function(data) {
			auth.name = data.name;
			auth.username = data.username;
			auth.isAdmin = data.is_admin;
			auth.isAuthenticated = true;				
        },  
        	getDetails = function() {
        	return auth;
        }
        return { login : login, reset : reset, getDetails : getDetails};
    }).
    factory('AuthInterceptor', function ($q, $location, AuthenticationService) {
        return {
			request: function (config) {
			    return config || $q.when(config);
			},
			requestError: function (rejection) {
			    return $q.reject(rejection);
			},
            response: function (response) {               
            	if (response.data) {

            	}
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401) {
                    AuthenticationService.reset();
                    $location.path('/login');
                }

                return $q.reject(rejection);
            }
        }
    }).
	factory('Appointments', function($resource) {
		return $resource('/api/appointments/:appointmentId',
			{ appointmentId:'@_id' },
			{ update: { method: 'PUT'}}
		);	
	}).
	factory('Clients', function($resource) {
		return $resource('/api/clients/:clientId',
			{ clientId:'@_id' },
			{ update: { method: 'PUT'}}
		);	
	}).
	factory('ClientsAutocomplete', function($http,$q) {
		return {
			getClients : function(term) {
				var defer = $q.defer();
				$http.get('/api/clients',{ params : {cIndex: term}}).success(function(clients){
					defer.resolve(clients);
				}).error(function(err){
					defer.reject(err);
				});

				return defer.promise;

			}
		}
	}).
	factory('JobTypes', function($resource) {
		return $resource('/api/jobtypes/:jobTypeId',
			{ jobTypeId:'@_id' },
			{ update: { method: 'PUT'}}
		);	
	}).
	factory('Status', function($resource) {
		return $resource('/api/statuses/:statusId',
			{ statusId:'@_id' },
			{ update: { method: 'PUT'}}
		);	
	}).
	factory('Technicians', function($resource) {
		return $resource('/api/technicians/:technicianId',
			{ technicianId:'@_id' },
			{ update: { method: 'PUT'}}
		);	
	}).	
	value('version', '0.1');