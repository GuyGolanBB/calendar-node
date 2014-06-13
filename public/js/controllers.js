'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $location,$http,$modal, UserService,AuthenticationService) {
      $scope.loginFormData = {};      
      $scope.signupFormData = {};
      $scope.submit = {
        login : false,
        signup : false
      }
      $scope.details = {};
      

      UserService.isAuthenticated(function(data){
        if (data.isAuthenticated) {
          $scope.details.isAuthenticated =  true;
          $scope.details.name = data.name;
        }
      });

      $scope.login = function() {
        $scope.submit.login = true;    
        var isValid = this.loginForm.$valid;
        if (!isValid) {
          return;
        }

        UserService.login($scope.loginFormData,function(data) {        
          $scope.details.isAuthenticated = data.isAuthenticated;
          $scope.details.name = data.name;
          $scope.loginFormData = {};
          $location.path('/calendar');
        });        
        
        $scope.submit.login = false;
      };

      $scope.signup = function() {
        $scope.submit.signup = true;
        var isValid = this.signupForm.$valid;
        if (!isValid) {
          return;
        }

        UserService.signup($scope.signupFormData,function(data) {
          $scope.details.isAuthenticated = data.isAuthenticated;
          $scope.details.name = data.name;
          $scope.signupFormData = {};            
          $location.path('/calendar');
        });    

        $scope.submit.signup = false;
      };

      $scope.logout = function() {
          UserService.logout(function(){
            $scope.details.isAuthenticated = false;          
            $scope.details.name = false;  
            $location.path('/login');
          });                
      };

      $scope.openNewAppointment = function (size,data) {

        var modalAppointmentInstance = $modal.open({
          templateUrl: '/partials/appointmentForm',
          controller: 'AppointmentCtrl',
          size: size,
          scope: $scope,
          backdrop : 'static',
           resolve: {
            formData: function () {
               return data || {}
             }
           }
        });

        modalAppointmentInstance.result.then(function (response) {          
          $scope.$broadcast('addAppointment',response);
        }, function () {
          console.log('cancel');
        });
      };

      $scope.$on('currentAppointment',function(e,data) {
        $scope.openNewAppointment('lg',data);
      });
  }).
  controller('MyCtrl1', function ($scope) {
    // write Ctrl here

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  }).
  controller('CalendarCtrl', function($scope,AuthenticationService) {

  }).
  controller('AppointmentCtrl', function($scope,$rootScope,$modalInstance,formData,$filter,
              Appointments,Technicians,JobTypes,Status,ClientsAutocomplete) {
    $scope.formData = {};

    

    $scope.technicians = Technicians.query();
    $scope.statusList = Status.query();
    $scope.jobTypes = JobTypes.query();


    if (!$filter('isEmptyObject')(formData)) {
      $scope.formData = formData;
      $scope.clients = [];
      $scope.clients.push($scope.formData.client);   
      $scope.formData.client = formData.client._id;           
      $scope.formData.displayStartTime = formData.startTime;
      $scope.formData.displayEndTime = formData.endTime;        
    } else {
      $scope.formData.startTime = new Date();
      $scope.formData.displayStartTime = $scope.formData.startTime;
      $scope.formData.endTime = new Date($scope.formData.startTime.getTime() + (2*1000*60*60));
      $scope.formData.displayEndTime = $scope.formData.endTime;
      $scope.clients = [];
    }    
    

    $scope.createAppointment = function(isValid) {

      $scope.submitted = true;

      if (!isValid) { 
        return;
      }
      $scope.submitted = false;     
      var technicians = $scope.formData.technicians;

      if ($scope.formData._id) {
        Appointments.update({appointmentId : $scope.formData._id}, $scope.formData, function(appointment) {
          $modalInstance.close({appointment: appointment, technicians : technicians});          
        });

        $scope.formData = {}; 
        return;     
      }

      Appointments.save({},$scope.formData,function(appointment) {
        $modalInstance.close({appointment: appointment, technicians : technicians});        
      });


       $scope.formData = {};  
    };

    $scope.deleteAppointment = function(appointment) {
      Appointments.delete({},{_id : appointment._id});
    };
      
    $scope.getClients = function(val) {
      return ClientsAutocomplete.getClients(val).then(function(data){     
        $scope.clients = [];
        for (var i = data.length - 1; i >= 0; i--) {
          $scope.clients.push(data[i]);       
        };
        return $scope.clients;
      });     
    };
      
    $scope.formatLabel = function(model) {      
      for (var i = $scope.clients.length - 1; i >= 0; i--) {
        if ($scope.clients[i]._id === model) {
          return $scope.clients[i].cIndex;
        }
      };
    };

    //#region events   

    $scope.$on('deleteAppointment',function(err,appointmentId) {
      $scope.deleteAppointment({_id : appointmentId});
    });

    $scope.validateStartTime = function (newValue,oldValue,scope) {
      $scope.formData.displayStartTime = newValue;

      var now = new Date();         
      if (now > newValue) {       
        scope.$parent.appointmentForm.startTime.$setValidity('beforedate',false);
        return;
      }

      scope.$parent.appointmentForm.startTime.$setValidity('beforedate',true);
      
      if (!$scope.formData.endDate) {
        $scope.formData.endDate = new Date(newValue.getTime() + (2*1000*60*60));
        return;
      }
      var endDate = new Date($scope.formData.endDate);      
      if (endDate < newValue) {
        $scope.formData.endDate = new Date(newValue.getTime() + (2*1000*60*60));
      }      
    };

    $scope.validateEndTime = function (newValue,oldValue,scope) {
      var startTime = new Date($scope.formData.startTime);

      $scope.formData.displayEndTime = newValue;

      if (startTime > newValue) {
        scope.$parent.appointmentForm.endTime.$setValidity('beforestartdate',false);
        return;
      }   

      if (startTime.getDay() > newValue.getDay()) {
        scope.$parent.appointmentForm.endTime.$setValidity('beforestartdate',false);
        return;
      }


       scope.$parent.appointmentForm.endTime.$setValidity('beforestartdate',true);
    };  
    //#endregion

    $scope.reset = function(){
      $scope.formData = {};
      $scope.submitted = false;
      $scope.formData.displayStartTime = null;
      $scope.formData.displayEndTime = null;
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    }
  }).
  controller('TechnicianCtrl', function($scope,$rootScope, Technicians) {
    $scope.formData = {};

    $scope.technicians = Technicians.query();

    $scope.createTechnician = function(isValid) {

      if (!isValid) {
        return;
      }
            
      if ($scope.formData._id) {
        Technicians.update({technicianId : $scope.formData._id}, $scope.formData);    
        $scope.formData = {};
        return;
      }
      
      Technicians.save({},$scope.formData,function(technician) {
        $scope.technicians.push(technician);
      });


      $scope.formData = {};
    };


    $scope.editTechnician = function(technician) {
      $scope.formData = technician;
    };

    $scope.deleteTechnician = function(technician) {
      Technicians.delete({},{_id : technician._id});
      var index = $scope.technicians.indexOf(technician);
      $scope.technicians.splice(index,1);

    };

    $scope.updateAppointment = function(appointment) {
      var data = angular.copy(appointment);      
      data.client = data.client;
      data.status = data.status._id;          
      data.jobType = data.jobType._id;
      data.technicians = findRelatedTechnicians(appointment._id);
      $scope.$emit('currentAppointment',data);
    }

    $scope.deleteAppointment = function(technician,appointment) {
      var index = technician.appointments.indexOf(appointment),
        data = {
          name : technician.name,
          phone: technician.phone,
          isActive : technician.isActive,
          appointments : []
        };

      technician.appointments.splice(index,1);
      for (var i = technician.appointments.length - 1; i >= 0; i--) {
        data.appointments.push(technician.appointments[i]._id);
      }
      Technicians.update({technicianId : technician._id}, data);

      var relatedTechnicians = findRelatedTechnicians(appointment._id);
      if (!relatedTechnicians.length) {
        $rootScope.$broadcast('deleteAppointment',appointment._id);
      }
    }

    function findRelatedTechnicians(appointmentId) {
      var technicians = [],technician,appointment;
      for (var i = $scope.technicians.length - 1; i >= 0; i--) {
        technician = $scope.technicians[i];
        for (var j = technician.appointments.length - 1; j >= 0; j--) {
          appointment = technician.appointments[j];
          if (appointment._id === appointmentId) {
            technicians.push(technician._id);
          }
        };
      };

      return technicians;
    }

    $scope.$on('addAppointment',function(e,data) {            
      for (var i = $scope.technicians.length - 1; i >= 0; i--) {        
        for (var j = $scope.technicians[i].appointments.length - 1; j >= 0; j--) {
          if ($scope.technicians[i].appointments[j]._id === data.appointment._id) {
            $scope.technicians[i].appointments.splice(j,1);
          }         
        };
        
        if (data.technicians.indexOf($scope.technicians[i]._id) >= 0) {
          $scope.technicians[i].appointments.push(data.appointment)
        }
      };
    });
});
  