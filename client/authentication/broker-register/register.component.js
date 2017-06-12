
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import template from './register.html';

class RegisterCtrl {
    constructor($scope, $reactive, $state,$rootScope,Notification) {
      $reactive(this).attach($scope);

      this.updateTheme = function(themeSelected) {
           if(themeSelected != "Create New Theme") {
             $rootScope.themeName = themeSelected;
              var themePath = "themes/" + themeSelected + ".css"; 
       	     $('#currentTheme').remove(); 
            $('head').append('<link id="currentTheme" rel="stylesheet" href="' + 
                                   themePath + 
                                   '" type="text/css" />'); 
	   }
      }

      this.submit = function() {
       var brokersettings = [
        {
          'username': $rootScope.loggedInUser,
          'themeName': this.themeName,
	        'themePath': this.themeFile,
          'iconPath':  this.picFile,
          'displayName' : this.brokerDisplayName
        }          
      ];

        Meteor.subscribe("brokersettings",function() {
         	if(BrokerSettings.find({"username":$rootScope.loggedInUser}).count() == 0 ) {
            		for (var i = 0; i < brokersettings.length; i++) {
       				 BrokerSettings.insert(brokersettings[i]);
     			 }
                    Notification.success("Broker details updated - Redirecting to Broker Home");
                    $state.go("customerinsight");			
                } 
                
         });


      }
     }
  };
export default angular.module('register', [
    angularMeteor
    ])
  .component('register', {
    templateUrl: 'client/authentication/broker-register/register.html',
    controller: ['$scope', '$reactive', '$state','$rootScope','Notification', RegisterCtrl]
  });


