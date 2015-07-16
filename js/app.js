'use strict';

/* App Module */

var torqdTest = angular.module('torqdTest', [
  'ngRoute',
  'homeControllers'
]);

torqdTest.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'partials/index.html',
        controller: 'indexCtrl'
      }).
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignUpCtrl'
      }).
      when('/activities', {
        templateUrl: 'partials/activities.html',
        controller: 'ActivityCtrl'
      }).
      when('/connect', {
        templateUrl: 'partials/connect.html',
        controller: 'ConnectCtrl'
      }).
      when('/next', {
        templateUrl: 'partials/next.html',
        controller: 'nextCtrl'
      }).
      when('/addimg', {
        templateUrl: 'partials/addimage.html',
        controller: 'addimageCtrl'
      }).
      when('/complete', {
        templateUrl: 'partials/completesignup.html',
        controller: 'indexCtrl'
      }).
      when('/experience', {
        templateUrl: 'partials/experience.html',
        controller: 'expCtrl'
      }).
      when('/profile/:userid', {
        templateUrl: 'partials/profile.html',
        controller: 'profileCtrl'
      }).
      when('/friend-list/:userid', {
        templateUrl: 'partials/friendList.html',
        controller: 'friendListCtrl'
      }).
      when('/connection/:userid', {
        templateUrl: 'partials/friendList.html',
        controller: 'connectionCtrl'
      }).
      when('/album/:userid', {
        templateUrl: 'partials/album.html',
        controller: 'albumCtrl'
      }).
      when('/routes/:userid', {
        templateUrl: 'partials/routes.html',
        controller: 'routesCtrl'
      }).
      when('/video', {
        templateUrl: 'partials/torqkdTV.html',
        controller: 'videoCtrl'
      }).
      when('/mysports', {
        templateUrl: 'partials/mysports.html',
        controller: 'sportCtrl'
      }).
      when('/eventmap', {
        templateUrl: 'partials/eventmap.html',
        controller: 'expCtrl'
      }).
        when('/forum-listing', {
            templateUrl: 'partials/forumlisting.html',
            controller: 'forumCtrl'
        }).
        when('/forum-listing1/:id', {
            templateUrl: 'partials/forumlisting.html',
            controller: 'forumCtrl'
        }).
        when('/forum-details/:id', {
            templateUrl: 'partials/forumdetails.html',
            controller: 'forumDetCtrl'
        }).
        when('/move-topic/:id', {
            templateUrl: 'partials/move_topic.html',
            controller: 'moveTopicCtrl'
        }).
        when('/new-topic/:id', {
            templateUrl: 'partials/new_topic.html',
            controller: 'newTopicCtrl'
        }).
        when('/topic-details/:id', {
            templateUrl: 'partials/topic_det.html',
            controller: 'topicDetCtrl'
        }).
      when('/logout', {
		templateUrl: 'partials/index.html',
        controller: 'logoutCtrl'
      }).
      when('/comingsoon', {
		templateUrl: 'partials/comingsoon.html',
        controller: 'comingsoon'
      }).
        when('/event-details/:id', {
            templateUrl: 'partials/event_det.html',
            controller: 'eventDetCtrl'
        }).
        when('/add-event', {
            templateUrl: 'partials/event_add.html',
            controller: 'eventAddCtrl'
        }).
        when('/edit-event/:id', {
            templateUrl: 'partials/event_add.html',
            controller: 'eventEditCtrl'
        }).
        when('/group-details/:id', {
            templateUrl: 'partials/group_det.html',
            controller: 'groupDetCtrl'
        }).
        when('/add-group', {
            templateUrl: 'partials/add_group.html',
            controller: 'groupAddCtrl'
        }).
        when('/edit-profile', {
            templateUrl: 'partials/edit_profile.html',
            controller: 'editProfileCtrl'
        }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
