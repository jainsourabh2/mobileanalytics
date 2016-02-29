/// <reference path="../Scripts/angular-1.1.4.js" />

/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /app
      /controllers      
      /directives
      /services
      /partials
      /views

  #######################################################################*/

//var app = angular.module('customersApp', ['ngRoute']);
var nameApp = angular.module('nameApp', ['ngRoute','ngResource']);

//This configures the routes and associates each route with a view and a controller
nameApp.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/dashboard.html'
            
        })
        .when('/dashboard',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/dashboard.html'
            
        })
        .when('/insightsession',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/insightsession.html'
            
        })
        .when('/insightuser',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/insightuser.html'
            
        })
        .when('/deviceManufacturer',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
            devicesubtype: 'deviceManufacturer',
            
        })
        .when('/deviceModel',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
            devicesubtype: 'deviceModel',
            
        })
        .when('/deviceType',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'deviceType',
            
        })
        .when('/devicePlatform',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'devicePlatform',
            
        })
        .when('/deviceOSVersion',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'deviceOSVersion',
            
        })
        .when('/deviceAppVersion',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'deviceAppVersion',
            
        })
        .when('/deviceCarrier',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'deviceCarrier',
            
        })
        .when('/deviceResolution',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/device.html',
             devicesubtype: 'deviceResolution',
            
        })
        .when('/worldmap',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/worldmap.html'
            
        })
        .when('/userretention',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/userretention.html'
            
        })
        .when('/events',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/events.html'
            
        })
        .when('/eventscompare',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/eventscompare.html'
            
        })
        .when('/crashreports',
        {
            //controller: 'DashboardPageCtrl',
            templateUrl: '/app/views/crashreport.html'
            
        })
       // .otherwise({ redirectTo: '/' });
});




