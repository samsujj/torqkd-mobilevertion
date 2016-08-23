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
        when('/forgot-password', {
            templateUrl: 'partials/forgot_password.html',
            controller: 'FPasswordCtrl'
        }).
        when('/forgot-password-second-step', {
            templateUrl: 'partials/forgot_password2.html',
            controller: 'FPassword2Ctrl'
        }).
        when('/change-password', {
            templateUrl: 'partials/forgot_password3.html',
            controller: 'CPasswordCtrl'
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
        when('/test', {
            templateUrl: 'partials/test.html',
            controller: 'test'
        }).
      when('/complete', {
        templateUrl: 'partials/completesignup.html',
        controller: 'completeCtrl'
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
        when('/routes', {
            templateUrl: 'partials/routes.html',
            controller: 'routesCtrl'
        }).
        when('/routes/:userid', {
            templateUrl: 'partials/routes.html',
            controller: 'routesCtrl'
        }).
        when('/photo', {
            templateUrl: 'partials/photoAll.html',
            controller: 'photoCtrl'
        }).
        when('/video', {
            templateUrl: 'partials/torqkdTV.html',
            controller: 'videoCtrl'
        }).
      when('/mysports/:userid', {
        templateUrl: 'partials/mysports.html',
        controller: 'sportCtrl'
      }).
      when('/eventmap', {
        templateUrl: 'partials/eventmap.html',
        controller: 'eventmapCtrl'
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
        when('/add-route', {
            templateUrl: 'partials/add_route.html',
            controller: 'routeAddCtrl'
        }).
        when('/add-route1/:spId/:locName', {
            templateUrl: 'partials/add_route1.html',
            controller: 'routeAdd1Ctrl'
        }).
        when('/edit-profile', {
            templateUrl: 'partials/edit_profile.html',
            controller: 'editProfileCtrl'
        }).
        when('/sport/:id', {
            templateUrl: 'partials/sport_det.html',
            controller: 'sportDetCtrl'
        }).
        when('/sport-user/:id', {
            templateUrl: 'partials/sport_user.html',
            controller: 'sportUserCtrl'
        }).
        when('/post-details/:id/:type', {
            templateUrl: 'partials/post_det.html',
            controller: 'postDetCtrl'
        }).
        when('/post-details1/:id', {
            templateUrl: 'partials/post_det.html',
            controller: 'postDetCtrl1'
        }).
        when('/file-list', {
            templateUrl: 'partials/filelist.html',
            controller: 'fileListCtrl'
        }).
        when('/hastag/:hastag', {
            templateUrl: 'partials/hastagres.html',
            controller: 'hastagCtrl'
        }).
        when('/settings', {
            templateUrl: 'partials/blocksettings.html',
            controller: 'settingsCtrl'
        }).
        when('/allnotification', {
            templateUrl: 'partials/allnotification.html',
            controller: 'allnotificationCtrl'
        }).
        when('/dailypoll', {
            templateUrl: 'partials/dailypoll.html',
            controller: 'dailypollCtrl'
        }).
        when('/dailypoll-result/:id', {
            templateUrl: 'partials/dailypollres.html',
            controller: 'dailypollresCtrl'
        }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
