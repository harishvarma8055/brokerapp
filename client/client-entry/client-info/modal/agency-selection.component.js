
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './agency-selection.html';

import 'angular-component';



class agencySelectionControl {
  constructor($scope) {

    }

}
export default angular.module('agencySelectionModal', [
  angularMeteor
])
  .component('agencySelectionModal', {
    templateUrl: 'client/client-entry/client-info/modal/agency-selection.html',
    controller: ['$scope', agencySelectionControl]
  });
