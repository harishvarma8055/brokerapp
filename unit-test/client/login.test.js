import 'angular-mocks';
import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';




describe('login module', function () {

	    beforeEach(function() {
				
	    });

	    it('angular scope should exist', function() {
                inject(function($rootScope) {
                    scope = $rootScope.$new();
                });
                expect(scope).to.be.ok;
            });

		it('login function need to be tested', function () {		
			assert.equal("texts", "texts");

			var $compile;
			var $rootScope;
			var element;


			    // window.module('closedemo');

				inject(function($rootScope, $compile) {
                    var newScope = $rootScope.$new();
                    newScope.someModelVar = 'cow';
                    element = '<login-view></login-view>';
                    element = $compile(element)(newScope);
                    newScope.$digest();
                });
				//alert(element);
			expect(element).to.be.ok;
			//assert.equal(element[0], "texts");

			
			//assert.include(element[0].querySelector('h2').innerHTML, '0');

		})
		
	
	});