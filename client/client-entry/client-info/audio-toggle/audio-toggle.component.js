
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import template from './audio-toggle.html';

class AudioToggleCtrl {
  constructor($scope, $window) {
            // This is a horrible hack put in here, simply because I don't
            // fully understand the interactions between Angular and Meteor
            // and I want to get something done quickly.

            $window.audioEnabled = true;

            this.checkboxChange = function(value) {
                $window.audioEnabled = $('#audioEnabled').is(
                    ':checked')

                if ($window.audioEnabled) {
                    var audio = new Audio();
                    var downloadURL =
                        "https://text-to-speech-demo.mybluemix.net/api/synthesize?voice=en-US_AllisonVoice&text=" +
                        encodeURIComponent("Audio enabled");
                    audio.src = downloadURL;
                    audio.play();
                }
            }
        }
}
export default angular.module('audioToggle', [
    angularMeteor
    ])
  .component('audioToggle', {
    templateUrl: 'client/client-entry/client-info/audio-toggle/audio-toggle.html',
    controller: ['$scope','$window', AudioToggleCtrl]
  });

