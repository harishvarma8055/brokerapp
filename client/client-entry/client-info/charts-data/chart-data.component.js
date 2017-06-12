
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './chart-data.html';

class ChartDataCtrl {
    constructor($scope, $rootScope,$http,$stateParams,$document, $state,$window,$reactive,$filter) {

      this.changeState = function(state) {
        if(state == "dashboard") {
          $state.go('landingpage');
        } 
        if(state == "newloan") {
          $state.go('onboardcustomer');
        } 
        if(state == "newquote") {
          $state.go('createquote');
        }
      };

     //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
     this.redirectToMI = function(){
             $window.open('http://closebrothersmi.mybluemix.net/#/home', '_blank');
      };
     this.drillUp = function(){
           _this.drillDown = false;   
      };
     this.drillUpPieChart = function(){
           _this.drillDownPieChart= false;   
      };
     this.drillUpInstanceView = function(){
           _this.instanceView= false;   
      };
     this.drillToCharts = function(){
           _this.useFullPage = false;   
      };
      this.instanceView = false;
      var actualbrokerType = "silver";

      // Set the Content-Type 
      $http.defaults.headers.common["Content-Type"] = "application/json"; 
      var authenticationHeader = $rootScope.basicHeader;       
      $http.defaults.headers.common["Authorization"] = authenticationHeader ;

      var reviewAndPayInstances = [];
      var reviewDocumentInstances = [];
      var manualUnderWriteCountInstances = [];

      Meteor.call("getAllInstancesForProcess",authenticationHeader , function(error, results) {
             angular.forEach(JSON.parse(results.content).data.items, function(value, key) {
  		if(value.NAME== "Review and Pay") {
                   reviewAndPayInstances.push("CloseBrotherPolicy:" + value["PROCESS_INSTANCE.PIID"]);
                }
                if(value.NAME == "Review Document") {
                   reviewDocumentInstances.push("CloseBrotherPolicy:" + value["PROCESS_INSTANCE.PIID"]);
                }
                if(value.NAME== "Perform Manual Underwriting" && value["STATE"] != 'STATE_FINISHED') {
                   manualUnderWriteCountInstances.push("CloseBrotherPolicy:" + value["PROCESS_INSTANCE.PIID"]);
                }
	     });
               //alert(reviewAndPayInstances);alert(reviewDocumentInstances);alert(manualUnderWriteCountInstances);
                  
      });


      Meteor.subscribe("brokersettings",function() {
           var brokerRecords = BrokerSettings.find({"username":$rootScope.loggedInUser});
           var brokerRecord;
           brokerRecords.forEach(function(brokerRecord) {
      	      $rootScope.actualbrokerType = actualbrokerType;
      	      actualbrokerType  = brokerRecord.type;
              $rootScope.actualbrokerType = actualbrokerType;
              $rootScope.inputJson.policyApplication.brokerDetails.name = brokerRecord.addressline1;
              $rootScope.globalBrokerType = actualbrokerType.charAt(0).toUpperCase() + actualbrokerType.slice(1);
              $scope.$apply();
           });
          
      });
                                
     //alert("outside" +  $rootScope.inputJson.policyApplication.brokerDetails.name);

   this.useFullPage = false;


   this.refreshPieTable = function(xValue,yValue,category){
      // alert(xValue);alert(yValue);alert(category);
       this.instanceView = true;
       var paymentDueInstances = ["CloseBrotherPolicy:1151","CloseBrotherPolicy:1152"];
                   $scope.completedFlow = false;
                   $scope.reviewAndPay = false;
                   $scope.mailSent= false;
                   $scope.performManual= false;
                   $scope.reviewDocument= false;


                //alert(manualUnderWriteCountInstances);
                this.subscribe("brokerdetails", function() {
                 if(category == "Manual Underwriting") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$in": manualUnderWriteCountInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"unsigned"});
                   $scope.gridApi.grid.refresh();
                   $scope.performManual= true;
                 } else if(category == "Autoapproved") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$nin": manualUnderWriteCountInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"unsigned"});
                   $scope.gridApi.grid.refresh();
                   $scope.mailSent= true;
                 } else if(category == "Notified Broker") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$in": reviewAndPayInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"success"});
                   $scope.gridApi.grid.refresh();
                   $scope.reviewAndPay = true;
                 } else if(category == "Reviewed and Payed") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$nin": reviewAndPayInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"success"});
                   $scope.gridApi.grid.refresh();
                   $scope.completedFlow = true;
                 } else if(category == "Declined") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"brokerName":$rootScope.loggedInUser,"status":"failure"})
                   $scope.gridApi.grid.refresh();
                   $scope.reviewDocument= true;
                 }  else if(category == "Payment Received") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$nin": paymentDueInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"settled"})
                   $scope.gridApi.grid.refresh();
                   $scope.completedFlow = true;
                 } else if(category == "Payment Due") {
                   $scope.pieGridOptions.data =  BrokerDetails.find({"instanceId": { "$in": paymentDueInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"settled"})
                   $scope.gridApi.grid.refresh();
                   $scope.completedFlow = true;
                 }








                 });
               
                          
      };

    this.refreshBarChart = function(xValue,yValue){
         
           var paymentDueInstances = ["CloseBrotherPolicy:1151","CloseBrotherPolicy:1152"]; 
           
           this.subscribe("brokerdetails", function() {
                 if(xValue == "0") {
                   var manualUnderWriteCount =  BrokerDetails.find({"instanceId": { "$in": manualUnderWriteCountInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"unsigned"}).count();
                   var autoApproveCount =  BrokerDetails.find({"instanceId": { "$nin": manualUnderWriteCountInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"unsigned"}).count();
                   $scope.columnCategories = ["Manual Underwriting", "Autoapproved"];
                   $scope.columnChartSeries = [['Manual Underwriting', manualUnderWriteCount],['Autoapproved',  autoApproveCount]];
                   $scope.columnColor = ['#f7a35c'] ; 

                 } else if(xValue == "1") {
                   var notifiedBrokerCount =  BrokerDetails.find({"instanceId": { "$in": reviewAndPayInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"success"}).count();
                   var reviewedAndPayedCount =  BrokerDetails.find({"instanceId": { "$nin": reviewAndPayInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"success"}).count();
                   $scope.columnCategories  = ["Notified Broker", "Reviewed and Payed"];
                   $scope.columnChartSeries = [['Notified Broker', notifiedBrokerCount],['Reviewed and Payed', reviewedAndPayedCount]];
                   $scope.columnColor = ['#90ed7d'] ;
                    
                 }  else if(xValue == "2") {
                   $scope.columnCategories  = ["Declined"];
                   $scope.columnChartSeries = [['Declined', yValue]];
                   $scope.columnColor = ['#d54339'] ;
                    
                 } else if(xValue == "3") {
                   $scope.columnCategories=  ['Payment Received','Payment Due'];
                   var dueCount = BrokerDetails.find({"instanceId": { "$in": paymentDueInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"settled"}).count();
                   var receivedCount = BrokerDetails.find({"instanceId": { "$nin": paymentDueInstances},$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"status":"settled"}).count();
                   $scope.columnChartSeries  = [['Payment Received', receivedCount],['Payment Due',dueCount]];
                   $scope.columnColor = ['#d1acff'] ;
                    
                 }
             $scope.columnChartConfig = {
    			options: {
                                  colors: $scope.columnColor,
				  chart: {
					type: 'column'
				  },
				  yAxis: {
					title: {
						text: 'Count'
					}
				  },
                                  xAxis: {
           				 categories: $scope.columnCategories
        			  },
				  plotOptions: {
					showInLegend: true,
					series: {
					  animation: {
								duration: 2500
							},
					  stacking: '',
					  point: {
							  events: {
								  click: function() {
									  _this.drillDownPieChart = true;
									  $scope.$apply();
									  _this.refreshPieTable(this.x,this.y,this.category);
									  
								  }
							  }
						  }
					}
				  }
				},
				series: [{
						type: 'column',
						name:'Status',
						data: $scope.columnChartSeries        }],
				title: {
				  text: 'Overall count'
				},
				credits: {
				  enabled: false
				},
				loading: false,
				size: {}
			  };

             $scope.$apply();

              });
                            
                          
      };

     


    this.refreshTable = function(category,yValue,seriesName){
              //alert(category);alert(yValue);alert(seriesName);

                if(seriesName == "Settled") {
                   $scope.completedFlow = true;
                   $scope.reviewAndPay = false;
                   $scope.mailSent= false;
                   $scope.performManual= false;
                   $scope.reviewDocument= false;

                } else {
                   $scope.reviewAndPay = true;
                   $scope.completedFlow = false;
                   $scope.mailSent= false;
                   $scope.performManual= false;
                   $scope.reviewDocument= false;

                }
               
                this.subscribe("brokerdetails", function() {
                 if(seriesName == "Signed") {
                   $scope.gridOptions.data =  BrokerDetails.find({$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"week":category,"status":"success"});
                   $scope.gridApi.grid.refresh();
                 } else if(seriesName == "Payment") {
                   $scope.gridOptions.data =  BrokerDetails.find({$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"week":category,"status":"completed"});
                   $scope.gridApi.grid.refresh();
                    
                 }  else if(seriesName == "DueFromClose") {
                   $scope.gridOptions.data =  BrokerDetails.find({$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"week":category,"status":"duefromclose"});
                   $scope.gridApi.grid.refresh();
                    
                 } else if(seriesName == "Settled") {
                   $scope.gridOptions.data =  BrokerDetails.find({$or: [{'brokerName':$rootScope.loggedInUser}, {'brokerName': 'all'}],"week":category,"status":"settled"});
                   $scope.gridApi.grid.refresh();
                    
                 }

                 });
               
                          
      };

      this.logout = function() {
        Meteor.loginFlag = false;
        $state.go('login');
      };

      $reactive(this).attach($scope);
      $scope.navbarCollapsed = true;
      this.colors = [{fillColor:["red"]},{fillColor:["green"]},{fillColor:["yellow"]},{fillColor:["blue"]}];
      this.trendType = "Reconcilation Based On Policy Type";
      this.labels = ["9.00 AM", "12.00 PM", "3.00 PM", "6.00 PM"];
      this.series = ['InProgress', 'Signed','Closed','Declined'];
      this.data = [
   	 [5, 9, 8, 5],
   	 	[8, 4, 4, 9],
         	[3, 2, 5, 3],
        	 [2, 2, 2, 2]
      ];

      this.pieLabels = ["InProgress", "Signed","Declined","Closed"];
      this.pieData = new ReactiveVar([]);
      this.pieData = [0, 0, 0,8];

      $scope.allInstances = {};
      $scope.chartSeries = [
    		{"name": "Signed", "data": [["Week 1",5], ["Week 2",2], ["Week 3", 3], ["Week 4",5]], type: "column","color":"#90ed7d"},
    		{"name": "Payment", "data": [["Week 1", 1], ["Week 2",1], ["Week 3",2], ["Week 4",2]], type: "column","color":"#f7a35c"},
    		{"name": "DueFromClose", "data": [["Week 1", 1], ["Week 2",2], ["Week 3",3], ["Week 4",2]], type: "column","color":"#d54339"},
    		{"name": "Settled", "data": [["Week 1", 1], ["Week 2",4], ["Week 3",1], ["Week 4",1]], type: "column","color":"#d1acff"}

        ];


      $scope.pieChartSeries = [{
            type: 'pie',
            name:'count',
            data: [
                ['InProgress', 0],
                ['Signed', 15],
                ['Declined', 0],
                ['Closed', 7]
            ]
            }];

 
  $scope.pieChartConfig = {
    options: {
      colors: ['#f7a35c', '#90ed7d', '#d54339', '#d1acff'],
      chart: {
        type: 'pie'
      },
      yAxis: {
        title: {
            text: 'Count'
        }
      },
      xAxis: {
            categories: ["InProgress", "Signed","Declined","Closed"]
        },
      plotOptions: {
        showInLegend: true,
        series: {
          animation: {
                    duration: 2500
                },
          stacking: '',
          point: {
                  events: {
                      click: function() {
                          _this.drillDownPieChart = true;
                          $scope.$apply();
                          //_this.refreshPieTable(this.x,this.y);
                          _this.refreshBarChart(this.x,this.y);
                          
                      }
                  }
              }
        }
      }
    },
    series: $scope.pieChartSeries,
    title: {
      text: 'Overall count'
    },
    credits: {
      enabled: false
    },
    loading: false,
    size: {}
  };


  $scope.chartConfig = {
    options: {
      chart: {
        type: 'areaspline'
      },
      yAxis: {
        title: {
            text: 'Count'
        }
      },
      xAxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        },
      plotOptions: {
        series: {
          animation: {
                    duration: 2500
                },
          stacking: '',
          point: {
                  events: {
                      click: function() {
                         // alert ('Category: '+ this.category +', value: '+ this.y);
                          _this.drillDown = true;
                          $scope.$apply();
                          _this.refreshTable(this.category,this.y,this.series.name);
                          
                      }
                  }
              }
        }
      }
    },
    series: $scope.chartSeries,
    title: {
      text: 'Last - 30 Days'
    },
    credits: {
      enabled: false
    },
    loading: false,
    size: {}
  };

      this.subscribe("brokerdetails" , function() {
  	var unsignedCount = BrokerDetails.find({"brokerName":$rootScope.loggedInUser,"status":"unsigned"}).count();
        var signedCount = BrokerDetails.find({"brokerName":$rootScope.loggedInUser,"status":"success"}).count();
        var declinedCount = BrokerDetails.find({"brokerName":$rootScope.loggedInUser,"status":"failure"}).count();
        this.pieData[0] =  unsignedCount;
        this.pieData[1] =  15+signedCount;
        this.pieData[2] =  declinedCount;

        var seriesSignedCount = BrokerDetails.find({$or: [{'brokerName': $rootScope.loggedInUser}],"week":"Week 4","status":"success"}).count();
        var paymentCount = BrokerDetails.find({$or: [{'brokerName': $rootScope.loggedInUser}],"week":"Week 4","status":"completed"}).count();
        var dueFromCloseCount = BrokerDetails.find({$or: [{'brokerName': $rootScope.loggedInUser}],"week":"Week 4","status":"duefromclose"}).count();
        var settledCount = BrokerDetails.find({$or: [{'brokerName': $rootScope.loggedInUser}],"week":"Week 4","status":"settled"}).count();


        $scope.pieChartConfig.series =  [{
            type: 'pie',
            name:'count',
            data: [
                ['InProgress', 0 + unsignedCount],
                ['Signed', 16 + signedCount],
                ['Declined', 0 + declinedCount],
                ['Closed', 8]
            ]
            }];

        $scope.chartConfig.series = [
    		{"name": "Signed", "data": [["Week 1",5], ["Week 2",3], ["Week 3", 3], ["Week 4",5 + seriesSignedCount]], type: "column","color":"#90ed7d"},
    		{"name": "Payment", "data": [["Week 1", 1], ["Week 2",1], ["Week 3",2], ["Week 4",2 + paymentCount ]], type: "column","color":"#f7a35c"},
    		{"name": "DueFromClose", "data": [["Week 1", 1], ["Week 2",2], ["Week 3",3], ["Week 4",2 + dueFromCloseCount ]], type: "column","color":"#d54339"},
    		{"name": "Settled", "data": [["Week 1", 1], ["Week 2",4], ["Week 3",1], ["Week 4",1 + settledCount]], type: "column","color":"#d1acff"}

        ];

      });

     
     $scope.chartTypes = [
    {"id": "line", "title": "Line"},
    {"id": "spline", "title": "Smooth line"},
    {"id": "area", "title": "Area"},
    {"id": "areaspline", "title": "Smooth area"},
    {"id": "column", "title": "Column"},
    {"id": "bar", "title": "Bar"},
    {"id": "pie", "title": "Pie"},
    {"id": "scatter", "title": "Scatter"}
  ];

  $scope.dashStyles = [
    {"id": "Solid", "title": "Solid"},
    {"id": "ShortDash", "title": "ShortDash"},
    {"id": "ShortDot", "title": "ShortDot"},
    {"id": "ShortDashDot", "title": "ShortDashDot"},
    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
    {"id": "Dot", "title": "Dot"},
    {"id": "Dash", "title": "Dash"},
    {"id": "LongDash", "title": "LongDash"},
    {"id": "DashDot", "title": "DashDot"},
    {"id": "LongDashDot", "title": "LongDashDot"},
    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
  ];

 this.drillDown = false;
 var _this =this;
  $scope.showInfo = function(row) {
        _this.processDiagramTitle = row.entity.instanceId;
        _this.useFullPage = true;
        
   };

  $scope.gridOptions = {
            showFooter: true,
    	    enableSorting: true,
            multiSelect: false,
            enableFiltering: true,     
            enableRowSelection: true, 
            enableSelectAll: false,
            enableRowHeaderSelection: false,
            selectionRowHeaderWidth: 35,  
            noUnselect: true,
            enableGridMenu: true,
    	    onRegisterApi: function(gridApi){
        	 $scope.gridApi = gridApi;
   		},
                columnDefs: [
		{ field: 'instanceId',displayName: 'Policy Reference',width: 200},
		{ field: 'customerName',displayName: 'Customer Name' },
 		{ field: 'totalAmountPayable',displayName: 'Amount Payable' },
		{ field: 'totalAmountOfCredit',displayName: 'Amount Of Credit' }
	    ],
            appScopeProvider: $scope.myAppScopeProvider,
            rowTemplate: "<div ng-click=\"grid.appScope.showInfo(row)\" ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
	    };

  $scope.pieGridOptions = {
            showFooter: true,
    	    enableSorting: true,
            multiSelect: false,
            enableFiltering: true,     
            enableRowSelection: true, 
            enableSelectAll: false,
            enableRowHeaderSelection: false,
            selectionRowHeaderWidth: 35,  
            noUnselect: true,
            enableGridMenu: true,
    	    onRegisterApi: function(gridApi){
        	 $scope.gridApi = gridApi;
   		},
                columnDefs: [
		{ field: 'instanceId',displayName: 'Policy Reference',width: 200},
		{ field: 'customerName',displayName: 'Customer Name' },
 		{ field: 'totalAmountPayable',displayName: 'Amount Payable' },
		{ field: 'totalAmountOfCredit',displayName: 'Amount Of Credit' }
	    ],
            appScopeProvider: $scope.myAppScopeProvider,
            rowTemplate: "<div ng-click=\"grid.appScope.showInfo(row)\" ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
	    };
      
  }
}
export default angular.module('chartData', [
    angularMeteor
    ])
  .component('chartData', {
    templateUrl: 'client/client-entry/client-info/charts-data/chart-data.html',
    controller: ['$scope', '$rootScope','$http','$stateParams','$document', '$state','$window','$reactive','$filter', ChartDataCtrl]
  });



