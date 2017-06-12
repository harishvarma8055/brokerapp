
import angularMeteor from 'angular-meteor';
import clientInfo from '../client-entry/client-info/client-info.component';
import loginView from '../authentication/login/login-view.component';
import register from '../authentication/broker-register/register.component';
import audioToggle from '../client-entry/client-info/audio-toggle/audio-toggle.component';
import chartData from '../client-entry/client-info/charts-data/chart-data.component';
import processDiagram from '../client-entry/client-info/process-diagram/process-diagram.directive';
import autoApprove from '../client-entry/client-info/auto-approve/auto-approve.component';
import additionalInfo from '../client-entry/client-info/auto-underwrite/auto-underwrite.component';

import searchCustomer from '../client-entry/search-client/search-client.component';
import createQuote from '../client-entry/create-quote/create-quote.component';
import landingPage from '../client-entry/landing-page/landing-page.component';
import documentUpload from '../client-entry/document-upload/document-upload.component';
import precontractInfo from '../client-entry/client-info/precontract-info/precontract-info.component';

import creditagreementExplanation from '../client-entry/compliance-details/creditagreement-explanation.directive';

import  agencySelectionModal from '../client-entry/client-info/modal/agency-selection.component.js';
import applyCustomRateModal from '../client-entry/client-info/modal/applyCustomRate.component.js';
import  esignModal from '../client-entry/client-info/modal/esign-modal.component.js';
import  paymentModal from '../client-entry/client-info/modal/payment-modal.component.js';

import  premiumCalculator from '../client-entry/premium-calculator/premium-calculator.component.js';
import  createCustomer from '../client-entry/create-customer/create-customer.component.js';
import createPayment from '../client-entry/create-payment/create-payment.component';

import baseEncode from '../services/base64.service';
import routing from '../route';
import routesValidation from '../routes-validation';
import initialize from '../app-initialize';



angular.module('closedemo', [angularMeteor, 'ui.router','ui-notification','duScroll','ui.bootstrap','datePicker','ui.grid', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.cellNav', 
	'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning','ui.grid.autoResize','naif.base64',baseEncode,
	loginView.name,clientInfo.name,register.name,audioToggle.name,chartData.name,esignModal.name,paymentModal.name,
	processDiagram,autoApprove.name,additionalInfo.name,searchCustomer.name,createQuote.name,createPayment.name,
	landingPage.name,documentUpload.name,creditagreementExplanation,precontractInfo.name,agencySelectionModal.name,applyCustomRateModal.name,
	premiumCalculator.name,createCustomer.name])
.config(routing)
.run(routesValidation)
.run(initialize);
