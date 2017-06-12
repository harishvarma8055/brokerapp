
import template from './creditagreement-explanation.html';

function creditagreementExplanation() {
    return {
    restrict: 'E',
    templateUrl: 'client/client-entry/compliance-details/creditagreement-explanation.html'
    }
}
export default angular.module('directives.creditagreementExplanation', [])
  .directive('creditagreementExplanation', creditagreementExplanation)
  .name;
