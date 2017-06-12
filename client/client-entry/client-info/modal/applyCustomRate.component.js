
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './applyCustomRate.html';

import 'angular-component';



class applyCustomRateControl {
  constructor($scope) {

  
}
}
export default angular.module('applyCustomRateModal', [
  angularMeteor
])
  .component('applyCustomRateModal', {
    templateUrl: 'client/client-entry/client-info/modal/applyCustomRate.html',
    controller: ['$scope', applyCustomRateControl]
  });
