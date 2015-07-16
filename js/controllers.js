'use strict';

/* Controllers */

var homeControllers1 = angular.module('homeControllers', ['angularValidator','ngDialog','ngCookies','ngFileUpload','ngAnimate', 'ngTouch','uiGmapgoogle-maps','ngSanitize','com.2fdevs.videogular','youtube-embed','highcharts-ng','shoppinpal.mobile-menu','ui.bootstrap','colorpicker.module', 'wysiwyg.module']);
//var homeControllers1 = angular.module('homeControllers', ['ngCookies']);

homeControllers1.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
}])

homeControllers1.run(['$rootScope', '$window',  
  function($rootScope, $window) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {

	FB.init({ 

		appId: '434078603403320', 
		status: true, 
		cookie: true, 
		xfbml: true 
    });

    

  };
  (function(d){
    var js, 
    id = 'facebook-jssdk', 
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script'); 
    js.id = id; 
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));
}]);

homeControllers1.directive('simpleSlider', ['SimpleSliderService', '$timeout', function (SimpleSliderService, $timeout) {

    'use strict';

    return {

      restrict: 'AE',
      scope: {
        onChange: '&',
        current: '=?currentSlide',
        slider: '=?sliderInstance'
      },

      link: function postLink(scope, element, attrs) {
        var options = attrs, disposeWatcher;

        if (attrs.onChange) {
          options.onChange = scope.onChange;
        } else {
          options.onChange = function (prev, next) {
            if (parseInt(scope.current) !== next) {
              $timeout(function () {
                scope.$apply(function () {
                  scope.current = next;
                });
              });
            }
          };
        }

        if (element[0].children.length === 0) {
          disposeWatcher = scope.$watch(function () {
            return element[0].children.length > 0;
          }, function (hasChildren) {
            if (hasChildren) {
              scope.slider = new SimpleSliderService(element[0], options);
              disposeWatcher();
            }
          });
        } else {
          scope.slider = new SimpleSliderService(element[0], options);
        }

        scope.$watch('current', function(next, prev) {
          if (next && next !== prev) {
            scope.slider.change(parseInt(next));
          }
        });

      }
    };
  }]);
homeControllers1.factory('SimpleSliderService', function () {

    'use strict';

    return typeof module != 'undefined' && module.exports ? // jshint ignore:line
      module.exports :
      context.SimpleSlider;
  });
 

homeControllers1.controller('indexCtrl', function($scope,$http, $rootScope, ngDialog, $timeout,$location,$cookieStore,$cookies,loggedInStatus) {
	
	$rootScope.fbSmsg = 0; 
	$rootScope.twSmsg = 0;
	$scope.sessUser = 0;


    $scope.email = $cookieStore.get('login_email1');
    $scope.password = $cookieStore.get('login_password1');

    $http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
			   	$http({
				   method  : 'POST',
                    async:   false,
				   url     : $scope.baseUrl+'/user/ajs/getFbmessage',
				   data    : $.param({'userid':data}), 
				   headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			   }) .success(function(data1) {
				   if(data1.pagename == 'album'){
						if(data1.type == 'facebook')
							$rootScope.fbSmsg = 1;
						if(data1.type == 'twitter')
							$rootScope.twSmsg = 1;
					    $location.path('/album/'+data);
                   }else if(data1.pagename == 'experience'){
                       if(data1.type == 'facebook')
                           $rootScope.fbSmsg = 1;
                       if(data1.type == 'twitter')
                           $rootScope.twSmsg = 1;
                       $location.path('/experience');
                   }else if(data1.pagename == 'routes'){
                       if(data1.type == 'facebook')
                           $rootScope.fbSmsg = 1;
                       if(data1.type == 'twitter')
                           $rootScope.twSmsg = 1;
                       $location.path('/routes/'+data);
				   }else if(data1.pagename == 'profile'){
						if(data1.type == 'facebook')
							$rootScope.fbSmsg = 1;
						if(data1.type == 'twitter')
							$rootScope.twSmsg = 1;
					   $location.path('/profile/'+data);
				   }else{
					   $location.path('/profile/'+data);
				   }
			   });
		   }else{
               if (typeof ($scope.email) != 'undefined' && typeof ($scope.password) != 'undefined') {
                   $http({
                       method  : 'POST',
                       async:   false,
                       url     : $scope.baseUrl+'/user/ajs/login',
                       data    : $.param({'email':$scope.email,'password':$scope.password}),  // pass in data as strings
                       headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                   }) .success(function(data) {
                       if(data > 0){
                           loggedInStatus.setStatus("true");
                           $cookieStore.put('login_email1',$scope.email);
                           $cookieStore.put('login_password1',$scope.password);
                           $location.path('/profile/'+data);
                       }else{
                           $location.path('/home');
                       }
                   });
               }else{
                   $location.path('/home');
               }

		   }
	   });
	
});

homeControllers1.controller('homeCtrl', function($scope,$http, $rootScope, ngDialog, $timeout,$location) {
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $location.path('/profile/'+data);
		   }
	   });
	
	$scope.openDefault = function () {
                ngDialog.open({
                    template: 'firstDialogId',
                });
            };
			
	$scope.openTerms = function () {
                ngDialog.open({
                    template: 'termsDialogId',
                });
            };
	$scope.openPrivacy = function () {
                ngDialog.open({
                    template: 'policyDialogId',
                });
            };
			
	$scope.next_com = function() {
		$location.path('/login');
	};

	
});


homeControllers1.service('loggedInStatus', function () {  var loggedIn = "";
	return {
		getStatus: function () {
			return loggedIn;
		},
		setStatus: function (value) {
			loggedIn = value;
		}
	};
});

homeControllers1.controller('loginCtrl',function($scope,$http,$location,$cookieStore,$cookies,loggedInStatus) {
	
	$scope.msgFlag = false;
	$scope.loggedIn = loggedInStatus.getStatus();
	
	
	$http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $location.path('/index');
        }
    });
	
		$scope.email = $cookieStore.get('login_email');
		$scope.password = $cookieStore.get('login_password');
		
	if (typeof ($scope.email) != 'undefined' && typeof ($scope.password) != 'undefined') {	
		$scope.form = {
			email: $scope.email,
			password: $scope.password,
			remember: true
		};


        $cookieStore.put('login_email',$scope.email);
        $cookieStore.put('login_password',$scope.password);


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/chkLogin',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            if(data > 0){
                loggedInStatus.setStatus("true");
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);
                $location.path('/profile/'+data);
             }
        });



	}
  
	$scope.submitloginForm = function() {
		if (typeof ($scope.form.remember) != 'undefined' && $scope.form.remember == true) {
			$cookieStore.put('login_email',$scope.form.email);
			$cookieStore.put('login_password',$scope.form.password);
		}else{
			$cookieStore.remove('login_email');
			$cookieStore.remove('login_password');
		}
		$http({
           method  : 'POST',
            async:   false,
           url     : $scope.baseUrl+'/user/ajs/login',
           data    : $.param($scope.form),  // pass in data as strings
           headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
       }) .success(function(data) {
               if(data > 0){
				   loggedInStatus.setStatus("true");
                   $cookieStore.put('login_email1',$scope.form.email);
                   $cookieStore.put('login_password1',$scope.form.password);
                   $location.path('/profile/'+data);
			   }else{
				   $scope.msgFlag = true;
			   }
	   });
	};
});

homeControllers1.controller('logoutCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,loggedInStatus,$cookieStore,$cookies) {
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/logout',
	}).success(function (result) {
		loggedInStatus.setStatus("false");
        $cookieStore.remove('login_email1');
        $cookieStore.remove('login_password1');
		$location.path('/index');
	});

	
});



homeControllers1.controller('SignUpCtrl', function($scope,$http,$location,$cookieStore,$cookies) {
	
	$scope.submitsignUpForm = function() {
		$cookieStore.put('login_email',$scope.form.email);
		$cookieStore.put('login_password',$scope.form.password);

		$http({
           method  : 'POST',
            async:   false,
           url     : $scope.baseUrl+'/user/ajs/signup',
           data    : $.param($scope.form),  // pass in data as strings
           headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
       }) .success(function(data) {
               //alert(data);
	   });
	

		$location.path('/activities');
	};


	$scope.myCustomValidator = function(text) {
		return true;
	};


	$scope.anotherCustomValidator = function(text) {
		if (text === "rainbow") {
			return true;
		} else return "type in 'rainbow'";
	};


	$scope.passwordValidator = function(password) {

		if (!password) {
			return;
		}
		else if (password.length < 6) {
			return "Password must be at least " + 6 + " characters long";
		}
		else if (!password.match(/[A-Z]/)) {
			return "Password must have at least one capital letter";
		}
		else if (!password.match(/[0-9]/)) {
			return "Password must have at least one number";
		}

		return true;
	};
	
	
	$scope.statelist = [];
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getStateList',
        }).success(function (result) {
        $scope.statelist = result;
    });
	
	
});

homeControllers1.controller('ActivityCtrl', function($scope,$http,$location) {
	$scope.sportsList = [];
	$scope.selSports = [];
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/allsports',
        }).success(function (result) {
        $scope.sportsList = result;
    });
	
	$scope.next_a = function() {
		if($scope.selSports.length){
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/addSport',
			   data    : 'spList='+($scope.selSports),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
		   }) .success(function(data) {
				   //alert(data);
		   });
		}
		$location.path('/connect')
	};
	
	$scope.selectSp = function(id) {
		var idx = $scope.selSports.indexOf(id);
		if (idx === -1) {
			$scope.selSports.push(id);
		}else{
			$scope.selSports.splice(idx,1);
		}
	};
	
	

});

homeControllers1.controller('ConnectCtrl', function($scope,$http,$location) {
	$scope.userList = [];
	$scope.selUsers = [];
	$scope.count = 0;
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/userList',
        }).success(function (result) {
        $scope.userList = result;
    });
	
	$scope.selectUser = function(id) {
		var idx = $scope.selUsers.indexOf(id);
		if (idx === -1) {
			$scope.selUsers.push(id);
			$scope.count = $scope.count+1;
		}else{
			$scope.selUsers.splice(idx,1);
			$scope.count = $scope.count-1;
		}
	};

	
	$scope.next_c = function() {
		if($scope.selUsers.length){
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/addFreind',
			   data    : 'userList='+($scope.selUsers),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
		   }) .success(function(data) {
				   //alert(data);
		   });
		}
		$location.path('/next')
	};
});

homeControllers1.controller('nextCtrl', function($scope, $http,$location,ngDialog) {
	
	$scope.form = {
			mailBody: "Be sure to check out torqkd.com. Torqk'd brings the consciousness of outdoor sports to a new, progressive social media realm. Torqk'd is a collective of runners, jumpers, climbers, riders, hikers, surfers and all who dare to smack the terrain from land, sky, powder and H2O. Now go get it!! Time to connect, track and explore. I use Torqk'd to connect, track and explore my favorite sports."
	};
	
	$scope.sendEmail = function() {
		var dialog1 = ngDialog.open({
                    template: '<div style="text-align:center;">Sending <img src="images/ajax_loading.gif"></div>',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false
        });
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/sendMail',
			   data    : $.param($scope.form),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
		   }) .success(function(data) {
				   dialog1.close();
				   var dial = ngDialog.open({
						template: '<div style="text-align:center;">Mail sent successfully.</div>',
						plain:true,
						showClose:false,
						closeByDocument: false,
						closeByEscape: false
				});
				setTimeout(function () {
                    dial.close();
                }, 2000);
		   });
	};
	
	$scope.social_share = function() {
		if($scope.social_select == 'fb'){
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					var uid = response.authResponse.userID;
					var accessToken = response.authResponse.accessToken;
					FB.ui(
						{
							method: 'feed',
							link: 'http://torqkd.com',
							},
						function(response) {
						}
					);
				} else if (response.status === 'not_authorized') {
					FB.logout(function(response) {
						// user is now logged out
					});
					FB.login(function(response) {
						if (response.authResponse) {
							FB.api('/me', function(response) {
								FB.ui(
									{
										method: 'feed',
										link: 'http://torqkd.com',
									},
									function(response) {
									}
								);
							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				} else {
					FB.login(function(response) {
						if (response.authResponse) {
							FB.api('/me', function(response) {
								FB.ui(
									{
										method: 'feed',
										link: 'http://torqkd.com',
									},
									function(response) {
									}
								);
							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				}
			});
			
		}
	};

	$scope.next_n = function() {
		$location.path('/addimg')
	};

});

homeControllers1.controller('addimageCtrl', function($scope, $http, $timeout, $compile, Upload) {
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
	$scope.profileImage = "";
	$scope.profileBackImage = "";

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/profileImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
			
			var ctime = (new Date).getTime();
			
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/profileimgresize',
			   data    : $.param({'filename':response.data,'height':156,'width':142,'foldername':'thumb'}),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
		   }).success(function(data) {
				$('.progress').addClass('ng-hide');
				$scope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data;
		   });
            
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
	
	
    $scope.$watch('files1', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/profileBackImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
			
			var ctime = (new Date).getTime();
			
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/profileBackimgresize',
			   data    : $.param({'filename':response.data,'height':536,'width':1175,'foldername':'thumb'}),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
		   }).success(function(data) {
				$('.progress').addClass('ng-hide');
				$scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data;
		   });
            
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
});

homeControllers1.controller('expCtrl', function($scope, $http,$interval,ngDialog,$sce,VG_VOLUME_KEY,$window,  uiGmapGoogleMapApi,$timeout,$rootScope ) {
		
	
	$scope.sessUser = 0;
	$scope.isMobileApp = '';
	$scope.curTime = new Date().getTime();
	
	$http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/checkMobile',
    }) .success(function(data) {
		$scope.isMobileApp = data;
    })
	
	$http({
           method  : 'POST',
           async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	});

	
	$http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/getCurLocation',
        }).success(function (result) {
	
			$scope.map = {
			  dragZoom: {options: {}},
			  control:{},
			  center: {
				latitude: result.latitude,
				longitude: result.longitude
			  },
			  pan: true,
			  zoom: 9,
			  refresh: false,
			  events: {},
			  bounds: {},
			  markers: result.marker,
		};
		
		

		});
		
	
	
	$scope.autoplay = true;
	$window.localStorage.setItem(VG_VOLUME_KEY, 0);
	
	$scope.openDefault = function () {
                ngDialog.open({
                    template: 'firstDialogId',
                });
            };
			
	$scope.slides = [];
	
	$http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/GetParentSports',
        }).success(function (result) {
        $scope.slides = result;
    });
	
	
	
	
	$scope.mainbanner = 'default.png';
	
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getMainBanner',
        }).success(function (result) {
        $scope.mainbanner = result;
    });
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getMainTv',
        }).success(function (result) {
			$scope.maintv = result;
			$scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];
			
			
    });
	
		
		$scope.bannerslides2 = [];
	
	$http({
            method: 'POST',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getBanner',
			data    : $.param({'pageid':1,'areaid':3,'sp_id':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.bannerslides2 = result;
    });

		$scope.bannerslides1 = [];
	
	$http({
            method: 'POST',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getBanner',
			data    : $.param({'pageid':1,'areaid':2,'sp_id':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.bannerslides1 = result;
    });

		
		
		
		$scope.statusList = [];
		$scope.eventList = [];
		$scope.groupList = [];
		
		$http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/getStatus',
			data    : $.param({'userid':0,'offset':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.statusList = result.status;
    });
		
		$http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/getEvents',
			data    : $.param({'userid':0,'offset':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.eventList = result;
    });
	
		$http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/getGroups',
			data    : $.param({'userid':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.groupList = result;
    });
	
	
	$scope.highchartsNG = [];
	$scope.chartdata = [];
	
	
	$http({
            method: 'POST',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/getStat',
        }).success(function (result) {
			$scope.stats = result;

			angular.forEach($scope.stats, function(val, key) {
				var highchartsNG = {
					options: {
						chart: {
							type: 'line'
						}
					},
					series: [{
						data: val.data,
						name : '<div style="color:#555555;">Month</div>',
						color : '#F79213'
					}],
					title: {
						text: '<div style="color:#555555;">Last 6 Months</div>'
					},
					loading: false,
					
					xAxis: {
						categories: val.mon
					},
					
					yAxis : {
						title: {
							text :  '<div style="color:#555555;">Activity</div>',
						}
					},
					
					tooltip : {
						valueSuffix : ''
					},
				}
				
				var chartdata = {
					sports_id : val.sports_id,
					sport_name : val.sport_name,
					imag_name : val.imag_name,
					activity_no : val.activity_no,
					total_dis : val.total_dis,
					total_time : val.total_time,
				}
				
				$scope.highchartsNG.push(highchartsNG);
				$scope.chartdata.push(chartdata);
			});

	
	});
	
	
	$scope.statusLike = function (item) {
			if(item.is_like){
				item.like_no = item.like_no-1;
			}else{
				item.like_no = item.like_no+1;
			}
            item.is_like = !item.is_like;	
			$http({
				method: 'POST',
                async:   false,
				url: $scope.baseUrl+'/user/ajs/likestatus',
				data    : $.param({'status_id':item.id,'user_id':item.c_user}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				
			});
	
        };
		
		$scope.postComment = function(item){
			if(item.pstval && typeof(item.pstval)!= 'undefined'){
				$http({
					method: 'POST',
                    async:   false,
					url: $scope.baseUrl+'/user/ajs/addcomment',
					data    : $.param({'status_id':item.id,'cmnt_body':item.pstval}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					if(item.comment_no){
						item.comment.push(result);
					}else{
						item.comment = [result];
					}
					item.comment_no = item.comment_no +1;
					item.pstval = '';
				});
			}else{
				alert('Please Enter Comment.')
			}
		};
		
		
		
		$scope.shareStaus = function(item){
			/*if($scope.isMobileApp){
				if(item.type == 'image'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbImgShareAndroid/user_id/'+item.user_id+'/img_id/'+item.value+'/sessid/'+$scope.sessUser+'/page/experience/type/status_img/hxrw/com.torkqd"';
				}else if(item.type == 'mp4'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+item.user_id+'/vid_id/'+item.value+'/type/2/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/experience"';
				}else if(item.type == 'youtube'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+item.user_id+'/vid_id/'+item.value+'/type/1/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/experience"';
				}else{
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbImgShareAndroid/user_id/'+item.user_id+'/img_id//sessid/'+$scope.sessUser+'/page/experience/type/status_img/hxrw/com.torkqd"';
				}
			}else{
					var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.type+'\',\''+item.value+'\')"';
			}*/

            var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.type+'\',\''+item.value+'\')"';

			$scope.dialog1 = ngDialog.open({
                    template: '<div style="width:100%; display:block; text-align:center; background:#fff;" >\
								<a '+ssh+' style="display: block;margin: 10px auto;"><img  src="images/texts1.png"   alt="#" /></a>\
								<a href="javascript:void(0)" ng-click="twShareStatus(\''+item.type+'\',\''+item.value+'\')" style="display: block;margin: 10px auto;"><img src="images/texts2.png"  alt="#" /></a>\
								<a target="_blank" href="http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.s_img+'&description=" style="display:block;margin: 10px auto;"><img src="images/texts3.png"   alt="#" /></a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
        });
		
		};
		
		$scope.fbShareStatus = function(type,value){
			$scope.dialog1.close();

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getFbAt',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result != ''){
                    var sss = 'Say Something About This Post';

                    if(type == 'image'){
                        var sss = 'Say Something About This Picture';
                    }
                    if(type == 'mp4' || type == 'youtube'){
                        var sss = 'Say Something About This Video';
                    }

                    $scope.dialog2 = ngDialog.open({
                        template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb1(\''+type+'\',\''+value+'\',\''+result+'\')" id="comment_btn">POST</a></div>',
                        plain:true,
                        closeByDocument: false,
                        closeByEscape: false,
                        scope: $scope
                    });
                }else{
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/experience/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }
            });
		};
		
		$scope.twShareStatus = function(type,value){
			$scope.dialog1.close();
			
			var sss = 'Say Something About This Post';
			
			if(type == 'image'){
				var sss = 'Say Something About This Picture';
			}
			if(type == 'mp4' || type == 'youtube'){
				var sss = 'Say Something About This Video';
			}
			
			$scope.dialog2 = ngDialog.open({
                    template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+value+'\',\''+type+'\')" id="comment_btn">POST</a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
			});
		};
		
		$scope.postTw = function(value,type){
			$scope.dialog2.close();
			var twText = $('#fbtext').val();
			
			var sType = 'text';
			if(type == 'image'){
				sType = 'statImg';
			}

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getTwOauth',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result.oauth_token == '' || result.oauth_token_secret == ''){
                    if($scope.isMobileApp){
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare2?image='+value+'&page=experience&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }else{
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=experience&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }
                }else{
                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/twitter3.php',
                        data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        $rootScope.twSmsg = 0;
                        $scope.showTwSucMsg();
                    });
                }


            });
				
			

		}


    $scope.postfb1 = function(type,value,accessToken){
        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbimage',
                data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }

    }



    $scope.postfb = function(type,value){
			var fbtext = $('#fbtext').val();
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					var uid = response.authResponse.userID;
					var accessToken = response.authResponse.accessToken;
					
						if(type == 'image'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbimage',
								data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'mp4'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'youtube'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
						}

					} else if (response.status === 'not_authorized') {
					FB.logout(function(response) {
						// user is now logged out
					});
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				} else {
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

								
							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				}
			});
			
			
		}
		
		$scope.showFbSucMsg = function(){
			$scope.showFbSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Facebook</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showFbSucMsg1.close();
			},3000);
		}
		
		$scope.showTwSucMsg = function(){
			$scope.showTwSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Twitter</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showTwSucMsg1.close();
			},3000);
		}
		
	if($rootScope.twSmsg == 1){
		$rootScope.twSmsg = 0;
		$scope.showTwSucMsg();
	}


	if($rootScope.fbSmsg == 1){
		$rootScope.fbSmsg = 0;
		$scope.showFbSucMsg();
	}
		
	

	$scope.tabs = [{
            title: 'social',
            url: 'social.tpl.html'
        }, {
            title: 'events',
            url: 'events.tpl.html'
        }, {
            title: 'groups',
            url: 'groups.tpl.html'
        }, {
            title: 'stats',
            url: 'stats.tpl.html'
    }];

    $scope.currentTab = 'social.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }


    $scope.openBanner = function(url){
        if($scope.isMobileApp){
            window.location.href = url;
        }else{
            window.open(url,'_blank');
        }
    }
		
});


homeControllers1.controller('profileCtrl', function($scope,$routeParams, $http,$interval,ngDialog,$sce,VG_VOLUME_KEY,$window,  uiGmapGoogleMapApi,$timeout,$location,Upload,$rootScope ) {
	
	$scope.isMobileApp = '';
	$scope.curTime = new Date().getTime();
	$scope.sessUser = 0;
	$scope.currentUser = $routeParams.userid;
	$scope.viewMore = 0;
	$scope.viewMoreLoad = 0;
	$scope.offset = 0;
	$scope.viewMoreEvent = 0;
	$scope.offsetevent = 0;
	$scope.status_id = 0;


	if($routeParams.userid == 0){
		$location.path('/login');
	}

    $scope.makeToast1 = function(msg){
        alert(msg);
        Android.showToast(msg);
    }




    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/checkMobile',
    }) .success(function(data) {
		$scope.isMobileApp = data;
    })
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;

               /*$http({
					method  : 'POST',
                    async:   false,
					url     : $scope.baseUrl+'/user/ajs/getTemp',
					data    : $.param({'userid':$scope.sessUser}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}) .success(function(data1) {
					if(data1.type == 'image'){
						$scope.isPhoto = 0;
						$scope.photoval = data1.file;
						$scope.statusType = 'image';
						$scope.statusValue = data1.file;
						$scope.isStatusInput = 1;
						$scope.isRotateBtn = 1;
					}
					if(data1.type == 'video'){
						$scope.videoval1 = '';
						$scope.photoval = '';
						$scope.videoval2 = data1.file;
						$scope.isPhoto = 0;
						$scope.isVideo = 0;
						
						$scope.isPhoto = 0;
						$scope.statusType = 'video';
						$scope.statusValue = data1.file;
						$scope.isStatusInput = 1;
					}
					
				});*/

               $http({
                   method  : 'POST',
                   async:   false,
                   url     : $scope.baseUrl+'/user/ajs/getTempFile',
                   data    : $.param({'userid':$scope.sessUser}),
                   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
               }) .success(function(result) {
                   if(typeof(result.id) != 'undefined'){

                       if(result.type == 'image'){
                           $scope.isPhoto = 0;
                           $scope.photoval = result.value;
                           $scope.statusType = 'image';
                           $scope.statusValue = result.value;
                           $scope.isStatusInput = 1;
                           $scope.isRotateBtn = 1;
                           $scope.status_id = result.id;
                       }
                       if(result.type == 'video'){
                           $scope.videoval1 = '';
                           $scope.photoval = '';
                           $scope.videoval2 = result.value;
                           $scope.isPhoto = 0;
                           $scope.isVideo = 0;

                           $scope.isPhoto = 0;
                           $scope.statusType = 'video';
                           $scope.statusValue = result.value;
                           $scope.isStatusInput = 1;
                           $scope.status_id = result.id;
                       }


                       $location.hash('statusinput');
                   }
               });

		   }
	   });

    $scope.openBanner = function(url){
        if($scope.isMobileApp){
            window.location.href = url;
        }else{
            window.open(url,'_blank');
        }

    }


	$scope.statDet = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getstatdetails',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.statDet = result;
    });
	
	$scope.bannerslides1 = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getBanner',
			data    : $.param({'pageid':3,'areaid':2,'sp_id':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.bannerslides1 = result;
    });

	$scope.bannerslides2 = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getBanner',
			data    : $.param({'pageid':3,'areaid':3,'sp_id':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.bannerslides2 = result;
    });
	
	
	$scope.tabs = [{
            title: 'social',
            url: 'social.tpl.html'
        }, {
            title: 'events',
            url: 'events.tpl.html'
        }, {
            title: 'groups',
            url: 'groups.tpl.html'
        }, {
            title: 'stats',
            url: 'stats.tpl.html'
    }];

    $scope.currentTab = 'social.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }


	$scope.statusLike = function (item) {
			if(item.is_like){
				item.like_no = item.like_no-1;
			}else{
				item.like_no = item.like_no+1;
			}
            item.is_like = !item.is_like;	
			$http({
				method: 'POST',
                async:   false,
				url: $scope.baseUrl+'/user/ajs/likestatus',
				data    : $.param({'status_id':item.id,'user_id':item.c_user}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				
			});
	
        };
		
		$scope.postComment = function(item){
			if(item.pstval && typeof(item.pstval)!= 'undefined'){
				$http({
					method: 'POST',
                    async:   false,
					url: $scope.baseUrl+'/user/ajs/addcomment',
					data    : $.param({'status_id':item.id,'cmnt_body':item.pstval}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					if(item.comment_no){
						item.comment.push(result);
					}else{
						item.comment = [result];
					}
					item.comment_no = item.comment_no +1;
					item.pstval = '';
				});
			}else{
				alert('Please Enter Comment');
			}
		};
		
		
		
		$scope.shareStaus = function(item){
           /*if($scope.isMobileApp){
				if(item.type == 'image'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbImgShareAndroid/user_id/'+item.user_id+'/img_id/'+item.value+'/sessid/'+$scope.sessUser+'/page/profile/type/status_img/hxrw/com.torkqd"';
				}else if(item.type == 'mp4'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+item.user_id+'/vid_id/'+item.value+'/type/2/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/profile"';
				}else if(item.type == 'youtube'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+item.user_id+'/vid_id/'+item.value+'/type/1/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/profile"';
				}else{
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbImgShareAndroid/user_id/'+item.user_id+'/img_id//sessid/'+$scope.sessUser+'/page/profile/type/status_img/hxrw/com.torkqd"';
				}
			}else{
					var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.type+'\',\''+item.value+'\')"';
			}*/

//            var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbgetAT/user_id/'+item.user_id+'/img_id/'+item.value+'/sessid/'+$scope.sessUser+'/page/profile/type/status_img"';
            var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.type+'\',\''+item.value+'\')"';
            $scope.dialog1 = ngDialog.open({
                    template: '<div style="width:100%; display:block; text-align:center; background:#fff;" >\
								<a '+ssh+' style="display: block;margin: 10px auto;"><img  src="images/texts1.png"   alt="#" /></a>\
								<a href="javascript:void(0);" ng-click="twShareStatus(\''+item.type+'\',\''+item.value+'\')"" style="display: block;margin: 10px auto;"><img src="images/texts2.png"  alt="#" /></a>\
								<a target="_blank" href="http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.s_img+'&description=" style="display:block;margin: 10px auto;"><img src="images/texts3.png"   alt="#" /></a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
        });
		
		};
		
		$scope.fbShareStatus = function(type,value){
			$scope.dialog1.close();

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getFbAt',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result != ''){
                    var sss = 'Say Something About This Post';

                    if(type == 'image'){
                        var sss = 'Say Something About This Picture';
                    }
                    if(type == 'mp4' || type == 'youtube'){
                        var sss = 'Say Something About This Video';
                    }

                    $scope.dialog2 = ngDialog.open({
                        template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb1(\''+type+'\',\''+value+'\',\''+result+'\')" id="comment_btn">POST</a></div>',
                        plain:true,
                        closeByDocument: false,
                        closeByEscape: false,
                        scope: $scope
                    });
                }else{
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }
            });
		};
		
		$scope.twShareStatus = function(type,value){
			$scope.dialog1.close();
			
			var sss = 'Say Something About This Post';
			
			if(type == 'image'){
				var sss = 'Say Something About This Picture';
			}
			if(type == 'mp4' || type == 'youtube'){
				var sss = 'Say Something About This Video';
			}
			
			$scope.dialog2 = ngDialog.open({
                    template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+value+'\',\''+type+'\')" id="comment_btn">POST</a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
			});
		};
		
		$scope.postTw = function(value,type){
			$scope.dialog2.close();
			var twText = $('#fbtext').val();
			
			var sType = 'text';
			if(type == 'image'){
				sType = 'statImg';
			}

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getTwOauth',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result.oauth_token == '' || result.oauth_token_secret == ''){
                    if($scope.isMobileApp){
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare2?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }else{
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }
                }else{
                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/twitter3.php',
                        data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        $rootScope.twSmsg = 0;
                        $scope.showTwSucMsg();
                    });
                }


            });
			

			
		}


    $scope.postfb1 = function(type,value,accessToken){
        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbimage',
                data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {

                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }

            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }

    }
		
		$scope.postfb = function(type,value){
			var fbtext = $('#fbtext').val();
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					var uid = response.authResponse.userID;
					var accessToken = response.authResponse.accessToken;
					
						if(type == 'image'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbimage',
								data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'mp4'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'youtube'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
						}

					} else if (response.status === 'not_authorized') {
					FB.logout(function(response) {
						// user is now logged out
					});
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					},{scope: 'email,user_likes,publish_actions'});
				} else {
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

								
							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					},{scope: 'email,user_likes,publish_actions'});
				}
			});
			
			
		}
		
				
		$scope.showFbSucMsg = function(){
			$scope.showFbSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Facebook</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showFbSucMsg1.close();
			},3000);
		}
		
		$scope.showTwSucMsg = function(){
			$scope.showTwSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Twitter</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showTwSucMsg1.close();
			},3000);
		}
		
	if($rootScope.twSmsg == 1){
		$rootScope.twSmsg = 0;
		$scope.showTwSucMsg();
	}


	if($rootScope.fbSmsg == 1){
		$rootScope.fbSmsg = 0;
		$scope.showFbSucMsg();
	}
	
	
	$scope.statusList = [];
	$scope.eventList = [];
	$scope.groupList = [];
		
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getStatus',
			data    : $.param({'userid':$routeParams.userid,'offset':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.statusList = result.status;
			if(result.totalCount > $scope.statusList.length){
				$scope.viewMore = 1;
				$scope.offset = 5;
			}
    });
	
		$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getEvents',
			data    : $.param({'userid':$routeParams.userid,'offset':0}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.eventList = result.event;
			if(result.totalCount > $scope.eventList.length){
				$scope.viewMoreEvent = 1;
				$scope.offsetevent = 5;
			}
			
		});
	
		$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getGroups',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.groupList = result;
    });

	$scope.highchartsNG = [];
	$scope.chartdata = [];
	
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getUserStat',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.stats = result;

			angular.forEach($scope.stats, function(val, key) {
				var highchartsNG = {
					options: {
						chart: {
							type: 'line'
						}
					},
					series: [{
						data: val.data,
						name : '<div style="color:#555555;">Month</div>',
						color : '#F79213'
					}],
					title: {
						text: '<div style="color:#555555;">Last 6 Months</div>'
					},
					loading: false,
					
					xAxis: {
						categories: val.mon
					},
					
					yAxis : {
						title: {
							text :  '<div style="color:#555555;">Activity</div>',
						}
					},
					
					tooltip : {
						valueSuffix : ''
					},
				}
				
				var chartdata = {
					sports_id : val.sports_id,
					sport_name : val.sport_name,
					imag_name : val.imag_name,
					activity_no : val.activity_no,
					total_dis : val.total_dis,
					total_time : val.total_time,
				}
				
				$scope.highchartsNG.push(highchartsNG);
				$scope.chartdata.push(chartdata);
			});

	
	});
	
	$scope.leftVisible = false;
	
	$scope.showLeft = function(e) {
        $scope.leftVisible = !$scope.leftVisible;
        e.stopPropagation();
    };
	
	$scope.frndno = 0;
	$scope.frnddet = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getFriendDet',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.frndno = result.frndno;
			$scope.frnddet = result.frnddet;
    });

	$scope.userDet = function(item){
		var sphtml = '';
		angular.forEach(item.sports, function(val, key) {
			sphtml += '<img src="'+val.imag_name+'" width="25"  alt="#" />';
		});
		$scope.dialog5 = ngDialog.open({
                    template: '<div>\
					<ul>\
						<li style="width:98px; float: left;  display:block;">\
							<img src="'+item.user_image+'" style="max-height:110px; max-width:98px;"  alt="#" />\
						</li>\
						\
						<li  style="margin-left:0px; width:162px; float: right; display:block;">\
							<a href="javascript:void(0);" ng-click="redirectUser('+item.id+')" style="width: 100px;">'+item.user_name+'</a>\
							<div class="clear"></div>'+sphtml+'\
							<a href="javascript:void(0);" ng-click="redirectUser('+item.id+')" class="popupSeemore">See More</a>\
							\
							<div class="clear"></div>\
						</li>\
					</ul>\
				</div>',
					plain:true,
					showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
					className : 'newPopup',
					scope:$scope
        });
	}
	
	$scope.redirectUser = function(id){
		$scope.dialog5.close();
		
		$location.path('/profile/'+id);
	}
	
	$scope.userdet = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getUserDet',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.userdet = result.userdet;
    });
	
	$scope.isStatusInput = 0;
	$scope.isRotateBtn = 0;
	$scope.photoval = '';
	$scope.videoval1 = '';
	$scope.videoval2 = '';
	$scope.isPhoto = 0;
	$scope.isVideo = 0;
	$scope.statusType = '';
	$scope.statusValue = '';
	$scope.statusText = '';
	$scope.shareVal = 1;
	$scope.group = 0;
	
	$scope.addPhoto = function(){
		$scope.videoval1 = '';
		$scope.photoval = '';
		$scope.videoval2 = '';
		$scope.isVideo = 0;
		$scope.isPhoto = 1;
		$scope.isStatusInput = 0;
	}
	
	$scope.addVideo = function(){
		$scope.videoval1 = '';
		$scope.photoval = '';
		$scope.videoval2 = '';
		$scope.isPhoto = 0;
		$scope.isVideo = 1;
		$scope.isStatusInput = 0;
	}
	
	$scope.postStatus = function(){
		if($scope.statusText || $scope.statusValue){
			$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/statusUpdate',
					data    : $.param({'msg':$scope.statusText,'share_with':$scope.shareVal,'group_id':$scope.group,'type':$scope.statusType,'value':$scope.statusValue,'is_status':1,'status_id':$scope.status_id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					$scope.isStatusInput = 0;
					$scope.isRotateBtn = 0;
					$scope.photoval = '';
					$scope.videoval1 = '';
					$scope.videoval2 = '';
					$scope.isPhoto = 0;
					$scope.isVideo = 0;
					$scope.statusType = '';
					$scope.statusValue = '';
					$scope.statusText = '';
					$scope.shareVal = 1;
					$scope.group = 0;
                    $scope.status_id = 0;
					
					
					$scope.statusList.splice(0, 0, result);
					$scope.offset = $scope.offset+1;
				});
		}else{
			alert("Please Enter Status");
		}
	}
	
	
	$scope.$watch('statusImage', function (files) {
		$scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
					upload(file);
                })(files[i]);
            }
        }
    });

	$scope.$watch('statusImage1', function (files) {
		$scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
					upload(file);
                })(files[i]);
            }
        }
    });

	
    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
		$scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
		file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/statusImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
			
			var ctime = (new Date).getTime();
			
			$http({
			   method  : 'POST',
                async:   false,
			   url     : $scope.baseUrl+'/user/ajs/statusimgresize',
			   data    : $.param({'filename':response.data}),  // pass in data as strings
			   headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
		   }).success(function(data) {
				$('.progress').addClass('ng-hide');
				
				$scope.isStatusInput = 0;
				$scope.isRotateBtn = 0;
				$scope.photoval = '';
				$scope.videoval1 = '';
				$scope.videoval2 = '';
				$scope.isPhoto = 0;
				$scope.isVideo = 0;
				$scope.statusType = '';
				$scope.statusValue = '';
				$scope.statusText = '';
				$scope.shareVal = 1;

				
				
				
				$scope.isPhoto = 0;
				$scope.photoval = response.data;
				$scope.statusType = 'image';
				$scope.statusValue = response.data;
				$scope.isStatusInput = 1;
				$scope.isRotateBtn = 1;
		   });
            
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
	
	$scope.vids = [];
	$scope.vidIndex = 1;
	
	$scope.youtubeSearch = function(){
		if($scope.vi == ''){
			alert('Please enter search key');
		}else{
			var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
			$scope.youtubeTxt = '';

			$http.get(dataurl).success(function(data){
				$scope.vids = data.items;
				$scope.ytdialog = ngDialog.open({
					template: 'youtubeVideo',
					showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
					className : 'youtubePopup',
					scope: $scope
				});
			});

		}
	}
	
	$scope.addYtVideo = function(item){
		
		
		$scope.isStatusInput = 0;
		$scope.isRotateBtn = 0;
		$scope.photoval = '';
		$scope.videoval1 = '';
		$scope.videoval2 = '';
		$scope.isPhoto = 0;
		$scope.isVideo = 0;
		$scope.statusType = '';
		$scope.statusValue = '';
		$scope.statusText = '';
		$scope.shareVal = 1;

		
		$scope.videoval1 = item.id.videoId;
		$scope.photoval = '';
		$scope.videoval2 = '';
		$scope.isPhoto = 0;
		$scope.isVideo = 0;
		
		$scope.isPhoto = 0;
		$scope.statusType = 'video';
		$scope.statusValue = item.id.videoId;
		$scope.isStatusInput = 1;
		
		$scope.ytdialog.close();
	}
	
	$scope.$watch('statusVideo', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/statusVidUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
			
			var ctime = (new Date).getTime();
				$('.progress').addClass('ng-hide');
				
				$scope.isStatusInput = 0;
				$scope.isRotateBtn = 0;
				$scope.photoval = '';
				$scope.videoval1 = '';
				$scope.videoval2 = '';
				$scope.isPhoto = 0;
				$scope.isVideo = 0;
				$scope.statusType = '';
				$scope.statusValue = '';
				$scope.statusText = '';
				$scope.shareVal = 1;

				
				$scope.videoval1 = '';
				$scope.photoval = '';
				$scope.videoval2 = response.data;
				$scope.isPhoto = 0;
				$scope.isVideo = 0;
				
				$scope.isPhoto = 0;
				$scope.statusType = 'video';
				$scope.statusValue = response.data;
				$scope.isStatusInput = 1;
            
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
	
	$scope.cancelStatus = function(){
		$scope.isStatusInput = 0;
		$scope.isRotateBtn = 0;
		$scope.photoval = '';
		$scope.videoval1 = '';
		$scope.videoval2 = '';
		$scope.isPhoto = 0;
		$scope.isVideo = 0;
		$scope.statusType = '';
		$scope.statusValue = '';
		$scope.statusText = '';
		$scope.shareVal = 1;
		$scope.group = 0;
		if($scope.status_id){
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/delTemp',
                data    : $.param({'status_id':$scope.status_id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $scope.status_id = 0;
            });
        }
	}

	$scope.imgRotate = function(type){
		$http({
				method: 'POST',
				async:   false,
				url: $scope.baseUrl+'/user/ajs/rotateleft',
				data    : $.param({'imgname':$scope.statusValue,'arg':type}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				$scope.photoval = result;
		});
	}
	
	$scope.delStatus = function(index){
		$scope.confirmDialog = ngDialog.open({
                    template: '<div style="text-align:center;">Are you sure delete this status?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false,
					className : 'confirmPopup',
					scope:$scope
        });
		
		
	}
	
	$scope.delConfirm = function(index){
		$scope.confirmDialog.close();
		$http({
				method: 'POST',
				async:   false,
				url: $scope.baseUrl+'/user/ajs/delstatus',
				data    : $.param({'status_id':$scope.statusList[index].id}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				$scope.statusList.splice(index,1);
				$scope.offset = $scope.offset-1;
		});
	}
	$scope.delComment = function(index,index1){
		$scope.confirmDialog = ngDialog.open({
                    template: '<div style="text-align:center;">Are you sure delete this status?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false,
					className : 'confirmPopup',
					scope:$scope
        });
		
		
	}
	
	$scope.delConfirm1 = function(index,index1){
		$scope.confirmDialog.close();
		$http({
				method: 'POST',
				async:   false,
				url: $scope.baseUrl+'/user/ajs/delcomment',
				data    : $.param({'comment_id':$scope.statusList[index].comment[index1].id}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				$scope.statusList[index].comment.splice(index1,1);
				$scope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
		});
	}
	
	$scope.delCancel = function(){
		$scope.confirmDialog.close();
	}
	
	
	
	$scope.viewMoreStatus = function(){
		$scope.viewMoreLoad = 1;
		$scope.viewMore = 0;
		$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getStatus',
			data    : $.param({'userid':$routeParams.userid,'offset':$scope.offset}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.viewMoreLoad = 0;
			$scope.statusList=$scope.statusList.concat(result.status);
			if(result.totalCount > $scope.statusList.length){
				$scope.viewMore = 1;
				$scope.offset = $scope.offset+5;
			}
		});
	}
	
	$scope.viewMoreEvent1 = function(){
		$scope.viewMoreLoad = 1;
		$scope.viewMoreEvent = 0;
		$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getEvents',
			data    : $.param({'userid':$routeParams.userid,'offset':$scope.offsetevent}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.viewMoreLoad = 0;
			$scope.eventList=$scope.eventList.concat(result.event);
			if(result.totalCount > $scope.eventList.length){
				$scope.viewMoreEvent = 1;
				$scope.offsetevent = $scope.offsetevent+5;
			}
		});
	}


    $scope.photoDet = {
        itemId : 0,
        pstval : '',
        imgSrc : '',
        value : '',
        is_status : '',
        userId : 0,
        userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        userName : '',
        timeSpan : '',
        msg : '',
        commentNo : 0,
        likeNo : 0,
        likeStatus : 'Like',
        cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        commentList : [],
        type: 'photo'
    };


    $scope.showPhoto = function(item){
         $scope.photoDet = {
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            likeStatus : (item.is_like)?"Unlike":"Like",
            likeNo : item.like_no,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment
        };
        ngDialog.open({
            template: 'photoComment',
            scope: $scope
        });
    }

    $scope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(item.commentList.length){
                    item.commentList.push(result);
                }else{
                    item.commentList = [result];
                }
                item.pstval = '';
            });
        }else{
            alert('Please Enter Comment');
        }
    };
	
	
});

homeControllers1.controller('friendListCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {
	
	$scope.isFrndList = 1;
	$scope.isConnectList = 0;
	$scope.sessUser = 0;
	$scope.currentUser = $routeParams.userid;
	
	if($routeParams.userid == 0){
		$location.path('/login');
	}
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	   });
	   
	   
	$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
	$scope.frnddet = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getFriendDet1',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.user_image = result.user_image;
			$scope.frnddet = result.frnddet;
    });

	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getsports1',
        }).success(function (result) {
			angular.element( document.querySelector( '#select-search' ) ).append(result); 
    });
	
	$scope.userDet = function(item,k){
		var sphtml = '';
		angular.forEach(item.sports, function(val, key) {
			sphtml += '<img src="'+val.imag_name+'" width="25"  alt="#" />';
		});
		$scope.dialog5 = ngDialog.open({
                    template: '<div class="frndPopup">\
					<ul>\
						<li style="width:98px; float: left;  display:block;">\
							<img src="'+item.user_image+'" style="max-height:110px; max-width:98px;"  alt="#" />\
						</li>\
						\
						<li  style="margin-left:0px; width:162px; float: right; display:block;">\
							<div class="clear"></div>'+sphtml+'\
							<a  href="javascript:void(0);" ng-if="'+(item.status == 1)+'" ng-click="cancel_request('+item.frnd_rel_id+','+k+')" > Cancel&nbsp;Request</a>\
							<a  href="javascript:void(0);" ng-if="'+(item.status == 2)+'" ng-click="redirectUser('+item.id+')" > View Profile</a>\
							<div class="clear"></div>\
						</li>\
					</ul>\
				</div>',
					plain:true,
					showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
					className : 'newPopup',
					scope:$scope
        });
	}
	
	$scope.redirectUser = function(id){
		$scope.dialog5.close();
		
		$location.path('/profile/'+id);
	}

	$scope.cancel_request = function(id,index){
		$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/cancelreq',
					data    : $.param({'id':id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					$scope.frnddet.splice(index,1); 
					$scope.dialog5.close();
			});
	}




});

homeControllers1.controller('connectionCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {
	
	$scope.isFrndList = 0;
	$scope.isConnectList = 1;
	$scope.sessUser = 0;
	$scope.currentUser = $routeParams.userid;
	
	if($routeParams.userid == 0){
		$location.path('/login');
	}
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	   });
	   
	   
	$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
	$scope.frnddet = [];
	
	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getFriendDet2',
			data    : $.param({'userid':$routeParams.userid}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
        }).success(function (result) {
			$scope.user_image = result.user_image;
			$scope.frnddet = result.frnddet;
    });

	$http({
            method: 'POST',
			async:   false,
            url: $scope.baseUrl+'/user/ajs/getsports1',
        }).success(function (result) {
			angular.element( document.querySelector( '#select-search' ) ).append(result); 
    });
	
	$scope.userDet = function(item,k){
		var sphtml = '';
		angular.forEach(item.sports, function(val, key) {
			sphtml += '<img src="'+val.imag_name+'" width="25"  alt="#" />';
		});
		$scope.dialog5 = ngDialog.open({
                    template: '<div class="frndPopup">\
					<ul>\
						<li style="width:98px; float: left;  display:block;">\
							<img src="'+item.user_image+'" style="max-height:110px; max-width:98px;"  alt="#" />\
						</li>\
						\
						<li  style="margin-left:0px; width:162px; float: right; display:block;">\
							<div class="clear"></div>'+sphtml+'\
							<a  href="javascript:void(0);" ng-if="'+(item.frnd_type == 0)+'" ng-click="addFriend('+item.id+','+k+')"> Connect +</a>\
							<a  href="javascript:void(0);" ng-if="'+(item.frnd_type == 1)+'" ng-click="cancel_request('+item.frnd_rel_id+','+k+')"> Cancel Request</a>\
							<a  href="javascript:void(0);" ng-if="'+(item.frnd_type == 2)+'" ng-click="accept_request('+item.frnd_rel_id+','+k+')"> Accept</a>\
							<a  href="javascript:void(0);" ng-if="'+(item.frnd_type == 4)+'" > Friend</a>\
							<div class="clear"></div>\
						</li>\
					</ul>\
				</div>',
					plain:true,
					showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
					className : 'newPopup',
					scope:$scope
        });
	}
	
	$scope.cancel_request = function(id,index){
		$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/cancelreq',
					data    : $.param({'id':id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					$scope.frnddet[index].frnd_type=0; 
					$scope.dialog5.close();
			});
	}

	$scope.accept_request = function(id,index){
		$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/acceptreq',
					data    : $.param({'id':id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					$scope.frnddet[index].frnd_type=4; 
					$scope.dialog5.close();
			});
	}
	
	$scope.addFriend = function(id,index){
		$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/addconn',
					data    : $.param({'userid':id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					$scope.frnddet[index].frnd_type=1; 
					$scope.dialog5.close();
			});
	}

});

homeControllers1.controller('albumCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,Upload) {

	$scope.sessUser = 0;
	$scope.currentUser = $routeParams.userid;
	
	$scope.isMobileApp = '';
	
	if($routeParams.userid == 0){
		$location.path('/login');
	}
	
	$http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/checkMobile',
    }) .success(function(data) {
		$scope.isMobileApp = data;
    })

	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	   });
	   
	   
	$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
	
	
	$scope.tabs = [{
            title: 'photo',
            url: 'photo.tpl.html'
        }, {
            title: 'video',
            url: 'video.tpl.html'
    }];

    $scope.currentTab = 'photo.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getUserDet',
		data    : $.param({'userid':$routeParams.userid}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
		$scope.user_image = result.userdet.user_image;
	});

	$scope.photoList = [];
	$scope.videoList = [];
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getImage',
		data    : $.param({'userid':$routeParams.userid}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
		$scope.photoList = result;
	});
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getVideo',
		data    : $.param({'userid':$routeParams.userid}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
		$scope.videoList = result;
	});

	$scope.liquidConfigurations =[{fill: true, horizontalAlign: "center", verticalAlign: "top"}];
	
	$scope.photoDet = {
		itemId : 0,
		pstval : '',
		imgSrc : '',
		value : '',
		is_status : '',
		userId : 0,
		userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		userName : '',
		timeSpan : '',
		msg : '',
		commentNo : 0,
		likeNo : 0,
		likeStatus : 'Like',
		cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		commentList : [],
		type: 'photo'
	};
	
	$scope.videoDet = {
		itemId : 0,
		pstval : '',
		imgSrc : '',
		userId : 0,
		userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		userName : '',
		timeSpan : '',
		msg : '',
		commentNo : 0,
		likeNo : 0,
		likeStatus : 'Like',
		cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		commentList : [],
		value : '',
		type : 'video',
		videoType : ''
	};
	
	$scope.showPhoto = function(item){
		$scope.photoDet.itemId = item.id;
		$scope.photoDet.value = item.value;
		$scope.photoDet.is_status = item.is_status;
		$scope.photoDet.userId = item.user_id;
		$scope.photoDet.userImage = item.user_image;
		$scope.photoDet.userName = item.user_name;
		$scope.photoDet.msg = item.msg;
		$scope.photoDet.timeSpan = item.timeSpan;
		$scope.photoDet.commentNo = item.commentNo;
		$scope.photoDet.likeNo = item.likeNo;
		$scope.photoDet.likeStatus = item.likeStatus;
		$scope.photoDet.cUserImage = item.cUserImage;


        var dialog1 = ngDialog.open({
                    template: '<div style="text-align:center;"><img src="images/ajax-loader.gif"></div>',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false
        });
		
		$http({
			method: 'POST',
			async:   false,
			url: $scope.baseUrl+'/user/ajs/getStatusComment',
			data    : $.param({'id':item.id}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
		}).success(function (result) {
			$scope.photoDet.commentList = result;
			dialog1.close();
			
			ngDialog.open({
				template: 'photoComment',
				scope: $scope
			});
            $scope.photoDet.imgSrc = item.img_src;
        });
	}
	$scope.showVideo = function(item){
		$scope.videoDet.itemId = item.id;
		$scope.videoDet.imgSrc = item.img_src;
		$scope.videoDet.userId = item.user_id;
		$scope.videoDet.userImage = item.user_image;
		$scope.videoDet.userName = item.user_name;
		$scope.videoDet.msg = item.msg;
		$scope.videoDet.timeSpan = item.timeSpan;
		$scope.videoDet.commentNo = item.commentNo;
		$scope.videoDet.likeNo = item.likeNo;
		$scope.videoDet.likeStatus = item.likeStatus;
		$scope.videoDet.cUserImage = item.cUserImage;
		$scope.videoDet.videoType = item.type;

		var dialog1 = ngDialog.open({
                    template: '<div style="text-align:center;"><img src="images/ajax-loader.gif"></div>',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false
        });
		
		$http({
			method: 'POST',
			async:   false,
			url: $scope.baseUrl+'/user/ajs/getStatusComment',
			data    : $.param({'id':item.id}),
			headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
		}).success(function (result) {
			$scope.videoDet.commentList = result;
			
			dialog1.close();
			
			ngDialog.open({
				template: 'videoComment',
				scope: $scope
			});
            $scope.videoDet.value = item.value;
        });
	}
		$scope.postComment = function(item){
			if(item.pstval && typeof(item.pstval)!= 'undefined'){
				$http({
					method: 'POST',
                    async:   false,
					url: $scope.baseUrl+'/user/ajs/addcomment',
					data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					if(item.type == 'photo'){
						if($scope.photoDet.commentList.length){
							$scope.photoDet.commentList.push(result);
						}else{
							$scope.photoDet.commentList = [result];
						}					
					}
					if(item.type == 'video'){
						if($scope.videoDet.commentList.length){
							$scope.videoDet.commentList.push(result);
						}else{
							$scope.videoDet.commentList = [result];
						}					
					}
					item.pstval = '';
				});
			}else{
				alert('Please Enter Comment.')
			}
		};
		
		
	$scope.shareImageStaus = function(item){
			if(item.is_status == 0){
				var imgFol = 'community_image';
				var ttt = 'image1';
				var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\'image1\',\''+item.value+'\')"';
			}else{
				var imgFol = 'status_img';
				var ttt = 'image';
				var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\'image\',\''+item.value+'\')"';
			}
			if($scope.isMobileApp){
				var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbImgShareAndroid/user_id/'+$scope.sessUser+'/img_id/'+item.value+'/sessid/'+$scope.sessUser+'/page/album/type/'+imgFol+'/hxrw/com.torkqd"';
			}
        var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+ttt+'\',\''+item.value+'\')"';
			$scope.dialog1 = ngDialog.open({
                    template: '<div style="width:100%; display:block; text-align:center; background:#fff;" >\
								<a '+ssh+' style="display: block;margin: 10px auto;"><img  src="images/texts1.png"   alt="#" /></a>\
								<a href="javascript:void(0)" ng-click="twShareStatus(\''+ttt+'\',\''+item.value+'\')" style="display: block;margin: 10px auto;"><img src="images/texts2.png"  alt="#" /></a>\
								<a target="_blank" href="http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.imgSrc+'&description=" style="display:block;margin: 10px auto;"><img src="images/texts3.png"   alt="#" /></a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
        });
	}
	
	$scope.shareVidStaus = function(item){
			var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.videoType+'\',\''+item.value+'\')"';
			if($scope.isMobileApp){
				if(item.videoType == 'youtube'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+$scope.sessUser+'/vid_id/'+item.value+'/type/1/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/album"';
				}
				if(item.videoType == 'mp4'){
					var ssh = 'href="'+$scope.baseUrl+'/user/profile/fbVidShareAndroid/user_id/'+$scope.sessUser+'/vid_id/'+item.value+'/type/2/sessid/'+$scope.sessUser+'/hxrw/com.torkqd/page/album"';
				}
			}
        var ssh = 'href="javascript:void(0);" ng-click="fbShareStatus(\''+item.videoType+'\',\''+item.value+'\')"';
			$scope.dialog1 = ngDialog.open({
                    template: '<div style="width:100%; display:block; text-align:center; background:#fff;" >\
								<a '+ssh+' style="display: block;margin: 10px auto;"><img  src="images/texts1.png"   alt="#" /></a>\
								<a href="javascript:void(0)" ng-click="twShareStatus(\'text\',\''+item.value+'\')" style="display: block;margin: 10px auto;"><img src="images/texts2.png"  alt="#" /></a>\
								<a target="_blank" href="http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.imgSrc+'&description=" style="display:block;margin: 10px auto;"><img src="images/texts3.png"   alt="#" /></a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
        });
	}
	
		$scope.fbShareStatus = function(type,value){
			$scope.dialog1.close();

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getFbAt',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result != ''){
                    var sss = 'Say Something About This Post';

                    if(type == 'image'){
                        var sss = 'Say Something About This Picture';
                    }
                    if(type == 'mp4' || type == 'youtube'){
                        var sss = 'Say Something About This Video';
                    }

                    $scope.dialog2 = ngDialog.open({
                        template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb1(\''+type+'\',\''+value+'\',\''+result+'\')" id="comment_btn">POST</a></div>',
                        plain:true,
                        closeByDocument: false,
                        closeByEscape: false,
                        scope: $scope
                    });
                }else{
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/album/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }
            });
		};
		
				
		$scope.twShareStatus = function(type,value){
			$scope.dialog1.close();
			
			var sss = 'Say Something About This Post';
			
			if(type == 'image'){
				var sss = 'Say Something About This Picture';
			}
			if(type == 'mp4' || type == 'youtube'){
				var sss = 'Say Something About This Video';
			}
			
			$scope.dialog2 = ngDialog.open({
                    template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+value+'\',\''+type+'\')" id="comment_btn">POST</a></div>',
					plain:true,
                    closeByDocument: false,
                    closeByEscape: false,
					scope: $scope
			});
		};
		
		$scope.postTw = function(value,type){
			$scope.dialog2.close();
			var twText = $('#fbtext').val();
			
			var sType = 'text';
			if(type == 'image'){
				sType = 'statImg';
			}
			if(type == 'image1'){
				sType = 'commImg';
			}



            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getTwOauth',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result.oauth_token == '' || result.oauth_token_secret == ''){
                    if($scope.isMobileApp){
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare2?image='+value+'&page=album&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }else{
                        window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=album&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                    }
                }else{
                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/twitter3.php',
                        data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        $rootScope.twSmsg = 0;
                        $scope.showTwSucMsg();
                    });
                }


            });
				
			

		}


    $scope.postfb1 = function(type,value,accessToken){
        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbimage',
                data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'image1'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbimage1',
                data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(typeof (result.error) != 'undefined'){
                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+value+'/sessid/'+$scope.sessUser+'/type/'+type+'/page/profile/device/'+$scope.isMobileApp;
                    window.location.href = url;
                }else{
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
                }
            });
        }

    }



    $scope.postfb = function(type,value){
			var fbtext = $('#fbtext').val();
			
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					var uid = response.authResponse.userID;
					var accessToken = response.authResponse.accessToken;
					
						if(type == 'image'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbimage',
								data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'image1'){
							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbimage1',
								data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'mp4'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else if(type == 'youtube'){

							$http({
								method: 'POST',
                                async:   false,
								url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
								data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
								headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
							}).success(function (result) {
								$scope.dialog2.close();
								$scope.showFbSucMsg();
							});
						}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
						}

					} else if (response.status === 'not_authorized') {
					FB.logout(function(response) {
						// user is now logged out
					});
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'image1'){
									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage1',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				} else {
					FB.login(function(response) {
						if (response.authResponse) {
							var accessToken = response.authResponse.accessToken;
							FB.api('/me', function(response) {
					
								if(type == 'image'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'image1'){
									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbimage1',
										data    : $.param({'image':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'mp4'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else if(type == 'youtube'){

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbYtvideo',
										data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}else{

									$http({
										method: 'POST',
                                        async:   false,
										url: $scope.baseUrl+'/user/ajs/postfbText',
										data    : $.param({'accessToken':accessToken,'com':fbtext}),
										headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
									}).success(function (result) {
										$scope.dialog2.close();
										$scope.showFbSucMsg();
									});
								}

								
							});
						} else {
							alert('User cancelled login or did not fully authorize.');
						}
					});
				}
			});
			
			
		}
		
		$scope.showFbSucMsg = function(){
			$scope.showFbSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Facebook</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showFbSucMsg1.close();
			},3000);
		}
		
		$scope.showTwSucMsg = function(){
			$scope.showTwSucMsg1 = ngDialog.open({
				template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Twitter</div>',
				plain:true,
				showClose:false,
				closeByDocument: true,
				closeByEscape: true
			});
								
			setTimeout(function(){
				$scope.showTwSucMsg1.close();
			},3000);
		}
		
	if($rootScope.twSmsg == 1){
		$rootScope.twSmsg = 0;
		$scope.showTwSucMsg();
	}
	if($rootScope.fbSmsg == 1){
		$rootScope.fbSmsg = 0;
		$scope.showFbSucMsg();
	}

		
		$scope.delComment = function(index,type){
			$scope.confirmDialog = ngDialog.open({
                    template: '<div style="text-align:center;">Are you sure delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+','+type+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false,
					className : 'confirmPopup',
					scope:$scope
        });
		
		
	}
	
	$scope.delConfirm = function(index,type){
		var com_id = 0;
		if(type == 0)
			var com_id = $scope.photoDet.commentList[index].id;
		if(type == 1)
			var com_id = $scope.videoDet.commentList[index].id;
		$scope.confirmDialog.close();
			$http({
					method: 'POST',
					async:   false,
					url: $scope.baseUrl+'/user/ajs/delcomment',
					data    : $.param({'comment_id':com_id}),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).success(function (result) {
					if(type == 0)
						$scope.photoDet.commentList.splice(index,1);
					if(type == 1)
						$scope.videoDet.commentList.splice(index,1);
			});
	}
	
	$scope.delCancel = function(){
		$scope.confirmDialog.close();
	}


    $scope.vids = [];
    $scope.vidIndex = 1;
    $scope.photoval="";
    $scope.videoval1="";
    $scope.videoval2="";
    $scope.type="";
    $scope.statusValue = "";
    $scope.isStatusInput=0;
    $scope.isRotateBtn=0;


    $scope.videoUploadDivOpen = function(){
        $scope.upVidDiv1 = ngDialog.open({
            template: 'upVidDiv',
            showClose:false,
            closeByDocument: true,
            closeByEscape: true,
            scope: $scope,
            controller: ['$scope', function($scope) {
                $scope.$watch('video123', function (files) {
                    $scope.formUpload = false;
                    if (files != null) {
                        for (var i = 0; i < files.length; i++) {
                            $scope.errorMsg = null;
                            (function (file) {
                                upload1(file);
                            })(files[i]);
                        }
                    }
                });




            }]
        });
    }



    $scope.youtubeSearch = function(){
        if($('#youtubeTxt').val() == ''){
            alert('Please enter search key');
        }else{
            $scope.upVidDiv1.close();

            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$('#youtubeTxt').val()+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $('#youtubeTxt').val('');

            $http.get(dataurl).success(function(data){
                $scope.vids = data.items;
                $scope.ytdialog = ngDialog.open({
                    template: 'youtubeVideo',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }

    $scope.addYtVideo = function(item){

        /*$http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/VideoAdd',
            data    : $.param({'value':item.id.videoId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $('.progress').addClass('ng-hide');
            if($scope.photoList.length){
                $scope.videoList.splice(0, 0, data);
            }else{
                $scope.videoList = [response.data.status];
            }
        });*/

        $scope.videoval1=item.id.videoId;
        $scope.statusValue = item.id.videoId;
        $scope.isStatusInput=1;
        $scope.type="video";


        $scope.ytdialog.close();


    }




    $scope.$watch('image', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
            '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/Uploadify_process_com' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/Resizeimage_com',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function() {
                $('.progress').addClass('ng-hide');
                $scope.photoval=response.data;
                $scope.statusValue = response.data;
                $scope.isStatusInput=1;
                $scope.isRotateBtn=1;
                $scope.type="image";
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/statusVidUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/VideoAdd',
                data    : $.param({'value':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.upVidDiv1.close();
                if($scope.videoList.length){
                    $scope.videoList.splice(0, 0, data);
                }else{
                    $scope.videoList = [data];
                }
            });




        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.imgRotate = function(type){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/rotateleft1',
            data    : $.param({'imgname':$scope.statusValue,'arg':type}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.photoval = result;
        });
    }


    $scope.cancelStatus = function(){
        $scope.vids = [];
        $scope.vidIndex = 1;
        $scope.photoval="";
        $scope.videoval1="";
        $scope.videoval2="";
        $scope.type="";
        $scope.statusValue = "";
        $scope.isStatusInput=0;
        $scope.isRotateBtn=0;
    }



    $scope.postStatus = function(){
        if(typeof($scope.statusText) == 'undefined'){
            $scope.statusText = '';
        }




        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/addAlbum',
            data    : $.param({'type':$scope.type,'value':$scope.statusValue,'msg':$scope.statusText}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (data) {
            if($scope.type == 'image'){
                if($scope.photoList.length){
                    $scope.photoList.splice(0, 0, data);
                }else{
                    $scope.photoList = [data];
                }
            }

            if($scope.type == 'video'){
                if($scope.videoList.length){
                    $scope.videoList.splice(0, 0, data);
                }else{
                    $scope.videoList = [data];
                }
            }

            $scope.vids = [];
            $scope.vidIndex = 1;
            $scope.photoval="";
            $scope.videoval1="";
            $scope.videoval2="";
            $scope.type="";
            $scope.statusValue = "";
            $scope.isStatusInput=0;
            $scope.isRotateBtn=0;


        });


    }










})
.directive('liquid', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
                $timeout(function () {
                    element.imgLiquid(scope[attr.liquid]);
                });
        }
    }
});


homeControllers1.controller('videoCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {
	
	$scope.sessUser = 0;

	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	});
	   
	$scope.videoList = [];
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getAllVideo',
		data    : $.param({'userid':$routeParams.userid}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
		$scope.videoList = result;
		//alert(result);
	});
	
	$scope.videoDet = {
		itemId : 0,
		pstval : '',
		imgSrc : '',
		userId : 0,
		userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		userName : '',
		timeSpan : '',
		msg : '',
		commentNo : 0,
		likeNo : 0,
		likeStatus : 'Like',
		cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
		commentList : [],
		value : '',
		type : '',
		ttype : '',
		videoType : ''
	};
	
	$scope.showVideo = function(item){
		$scope.videoDet.itemId = item.id;
		$scope.videoDet.imgSrc = item.img_src;
		$scope.videoDet.userId = item.user_id;
		$scope.videoDet.userImage = item.user_image;
		$scope.videoDet.userName = item.user_name;
		$scope.videoDet.msg = item.msg;
		$scope.videoDet.timeSpan = item.timeSpan;
		$scope.videoDet.commentNo = item.commentNo;
		$scope.videoDet.likeNo = item.likeNo;
		$scope.videoDet.likeStatus = item.likeStatus;
		$scope.videoDet.cUserImage = item.cUserImage;
		$scope.videoDet.videoType = item.type1;
		$scope.videoDet.value = item.value;
		$scope.videoDet.ttype = item.ttype;
		
		var dialog1 = ngDialog.open({
                    template: '<div style="text-align:center;"><img src="images/ajax-loader.gif"></div>',
					plain:true,
					showClose:false,
                    closeByDocument: false,
                    closeByEscape: false
        });
		
		if(item.ttype == 'status'){
			$http({
				method: 'POST',
				async:   false,
				url: $scope.baseUrl+'/user/ajs/getStatusComment',
				data    : $.param({'id':item.id}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				$scope.videoDet.commentList = result;
				
				dialog1.close();
				
				ngDialog.open({
					template: 'videoComment',
					scope: $scope
				});
			});
		}else{
			$http({
				method: 'POST',
				async:   false,
				url: $scope.baseUrl+'/user/ajs/getVideoComment',
				data    : $.param({'id':item.id}),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
			}).success(function (result) {
				$scope.videoDet.commentList = result;
				
				dialog1.close();
				
				ngDialog.open({
					template: 'videoComment',
					scope: $scope
				});
			});
		}
		
	}
	
		$scope.postComment = function(item){
			if(item.pstval && typeof(item.pstval)!= 'undefined'){
				if(item.ttype == 'status'){
					$http({
						method: 'POST',
						url: $scope.baseUrl+'/user/ajs/addcomment',
						data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval}),
						headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
					}).success(function (result) {
							if($scope.videoDet.commentList.length){
								$scope.videoDet.commentList.push(result);
							}else{
								$scope.videoDet.commentList = [result];
							}					
						
						item.pstval = '';
					});
				}
				if(item.ttype == 'video'){
					$http({
						method: 'POST',
                        async:   false,
						url: $scope.baseUrl+'/user/ajs/addvideocomment',
						data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval}),
						headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
					}).success(function (result) {
							if($scope.videoDet.commentList.length){
								$scope.videoDet.commentList.push(result);
							}else{
								$scope.videoDet.commentList = [result];
							}					
						
						item.pstval = '';
					});
				}
			}else{
				alert('Please Enter Comment');
			}
		};



	
});

homeControllers1.controller('sportCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {

	$scope.sessUser = 0;
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
			   if($scope.sessUser == 0){
					$location.path('/login');
				}
		   }
	   });
	   
	   
	$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getUserDet',
		data    : $.param({'userid':$scope.sessUser}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
		$scope.user_image = result.userdet.user_image;
	});
	
	
	$scope.sportsList = [];
	
	$http({
            method: 'GET',
        async:   false,
            url: $scope.baseUrl+'/user/ajs/usersports',
        }).success(function (result) {
        $scope.sportsList = result;
    });

	

});

homeControllers1.controller('forumCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {

    $scope.sessUser = 0;
    $scope.user_image = '';
    $scope.user_name = 'GUEST';
    $scope.spId = $routeParams.id;

    $scope.headingArr = [{
        id:0,
        value:'Forum',
        link:'#/forum-listing'
    }];

    if(typeof ($scope.spId) == 'undefined'){
        $scope.spId = 0;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getUserDet',
                data    : $.param({'userid':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.user_image = result.userdet.user_image;
                $scope.user_name = "Welcome "+result.userdet.user_name;
            });
        }
    });

    $scope.forumList = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getForumList',
        data    : $.param({'id':$scope.spId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.forumList = result;
        if($scope.spId > 0){
            $scope.headingArr.push({ id:result[0].id,value:result[0].sport_name,link:'#/forum-listing1/'+result[0].id})
        }
    });

});


homeControllers1.controller('forumDetCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {

    $scope.sessUser = 0;
    $scope.user_image = '';
    $scope.user_name = 'GUEST';
    $scope.forumId = $routeParams.id;

    $scope.headingArr = [{
        id:0,
        value:'Forum',
        link:'#/forum-listing'
    }];

    if(typeof ($scope.spId) == 'undefined'){
        $scope.spId = 0;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getUserDet',
                data    : $.param({'userid':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.user_image = result.userdet.user_image;
                $scope.user_name = "Welcome "+result.userdet.user_name;
            });
        }
    });

    $scope.forumDet = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getForumTopicList',
        data    : $.param({'id':$scope.forumId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.forumDet = result;
        $scope.headingArr.push({ id:result.parent_id,value:result.parent_name,link:'#/forum-listing1/'+result.parent_id},{id:result.id,value:result.name,link:'#/forum-details/'+result.id});

    });

    $scope.delTopic = function(id,index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this topic?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm = function(id,index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/delTopic',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.forumDet.topicList.splice(index,1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }



});

homeControllers1.controller('moveTopicCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {

    $scope.sessUser = 0;
    $scope.user_image = '';
    $scope.user_name = 'GUEST';
    $scope.topicId = $routeParams.id;
    $scope.topicTitle = '';
    $scope.allForum = [];

    $scope.headingArr = [{
        id:0,
        value:'Forum',
        link:'#/forum-listing'
    }];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getUserDet',
                data    : $.param({'userid':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.user_image = result.userdet.user_image;
                $scope.user_name = "Welcome "+result.userdet.user_name;
            });
        }
    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getTopicHArr',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
        $scope.topicTitle = result.topic_title;
        $scope.headingArr.push({ id:result.forum_category_id,value:result.forum_category_name,link:'#/forum-listing1/'+result.forum_category_id},{id:result.forum_id,value:result.forum_name,link:'#/forum-details/'+result.forum_id});
    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getAllForumList',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
        $scope.allForum = result;
    });

    $scope.moveTopic = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/moveTopic',
            data    : $.param({'topicId':$scope.topicId,'forumId':$scope.forumList.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result) {
            $location.path('/forum-details/'+$scope.forumList.id);
        });
    }


});


homeControllers1.controller('newTopicCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {
    $scope.sessUser = 0;
    $scope.user_image = '';
    $scope.user_name = 'GUEST';
    $scope.forumId = $routeParams.id;

    $scope.form = {
        forumId : $routeParams.id,
        parentId : 0
    }

    $scope.headingArr = [{
        id:0,
        value:'Forum',
        link:'#/forum-listing'
    }];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getUserDet',
                data    : $.param({'userid':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.user_image = result.userdet.user_image;
                $scope.user_name = "Welcome "+result.userdet.user_name;
            });
        }else{
            $location.path('/index');
        }
    });

    $scope.menu = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['format-block'],
        ['font'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['code', 'quote', 'paragraph'],
        ['link', 'image'],
        ['css-class']
    ];

    $scope.cssClasses = ['test1', 'test2'];

    $scope.addTopicForm = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/addnewTopic',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $location.path('/forum-details/'+$scope.forumId);

        });
    }

});


homeControllers1.controller('topicDetCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,$sce) {
    $scope.sessUser = 0;
    $scope.user_image = '';
    $scope.user_name = 'GUEST';
    $scope.topicId = $routeParams.id;
    $scope.topicTitle = '';
    $scope.topicDet = [];
    $scope.isReply = 0;

   /* $scope.form = {
        forumId : $routeParams.id,
        parentId : 0
    }*/

    $scope.headingArr = [{
        id:0,
        value:'Forum',
        link:'#/forum-listing'
    }];

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs/getUserDet',
                data    : $.param({'userid':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.user_image = result.userdet.user_image;
                $scope.user_name = "Welcome "+result.userdet.user_name;
            });
        }
    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getTopicHArr',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
        $scope.topicTitle = result.topic_title;
        $scope.headingArr.push({ id:result.forum_category_id,value:result.forum_category_name,link:'#/forum-listing1/'+result.forum_category_id},{id:result.forum_id,value:result.forum_name,link:'#/forum-details/'+result.forum_id},{ id:$scope.topicId,value:result.topic_title,link:'#/topic-details/'+$scope.topicId});
    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/addView',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
    });


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getTopicDetails',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
        $scope.topicDet = result;
        $scope.topicDet.description = $sce.trustAsHtml($scope.topicDet.description);

        $scope.form = {
            title:'Re: '+result.title,
            parentId:result.id,
            forumId:result.forum_id,
        }

    });


    $scope.addTopicForm = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/addnewTopic',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.isReply = 0;
            $scope.form = {
                title:result.title,
                parentId:result.parent_id,
                forumId:result.forum_id,
                description:'',
            }

            if($scope.topicDet.topic_reply.length > 0){
                $scope.topicDet.topic_reply.push(result);
            }else{
                $scope.topicDet.topic_reply = [result];
            }
        });
    }

    $scope.addTopicForm1 = function(item){
        alert(item.id);
    }


});



homeControllers1.controller('routesCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {
	$scope.sessUser = 0;
	$scope.currentUser = $routeParams.userid;
    $scope.isMobileApp = '';


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/checkMobile',
    }) .success(function(data) {
        $scope.isMobileApp = data;
    })
	
	
	if($routeParams.userid == 0){
		$location.path('/login');
	}
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	   });
	   
	   
	$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getUserDet',
        data    : $.param({'userid':$routeParams.userid}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.user_image = result.userdet.user_image;
    });

    $scope.routeList = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getRoutes',
        data    : $.param({'userid':$routeParams.userid}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.routeList = result;
    });

    $scope.map = {
        zoom: 13,
        lineStyle: {
            color: '#F7931E',
            weight: 4,
            opacity: 1
        }
    };

    $scope.delRoute = function(id,index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this route?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm = function(id,index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/delroute',
            data    : $.param({'route_id': id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.routeList.splice(index,1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $scope.canvasImage = '';


    $scope.fbShare = function(id){
        html2canvas($('#map'+id), {
            useCORS: true,
            onrendered: function(canvas) {
                var url = canvas.toDataURL();

                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/profile/canvastoimg',
                    data    : $.param({'data': url}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    var mapImage = result;

                    $('#mapconmain').html($('#mapcon'+id).html());


                    html2canvas($('#mapconmain'), {
                        useCORS: true,
                        onrendered: function(canvas) {
                            var url = canvas.toDataURL();

                            $http({
                                method: 'POST',
                                async:   false,
                                url: $scope.baseUrl+'/user/profile/canvastoimg1',
                                data    : $.param({'data': url}),
                                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                            }).success(function (result) {
                                var divImage = result;

                                $('#mapconmain').html('');

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs/imageMerge',
                                    data    : $.param({'image1':mapImage,'image2':divImage}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (res) {
                                    var shareImage = res;
                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs/getFbAt',
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (result) {
                                        if(result == ''){
                                            var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+shareImage+'/sessid/'+$scope.sessUser+'/type/text1/page/routes/device/'+$scope.isMobileApp;
                                            window.location.href = url;
                                        }else{
                                            var accessToken = result;
                                            $http({
                                                method: 'POST',
                                                async:   false,
                                                url: $scope.baseUrl+'/user/ajs/postfbRoutes',
                                                data    : $.param({'image':shareImage,'accessToken':accessToken}),
                                                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                            }).success(function (result) {
                                                if(typeof (result.error) != 'undefined'){
                                                    var url = $scope.baseUrl+'/user/profile/fbgetAT/value/'+shareImage+'/sessid/'+$scope.sessUser+'/type/text1/page/routes/device/'+$scope.isMobileApp;
                                                    window.location.href = url;
                                                }else{
                                                   $scope.showFbSucMsg();
                                                }
                                            });

                                        }
                                    });

                                });


                            });

                        }

                    });

                });

            }

        });
    }


    $scope.twShare = function(id){
        html2canvas($('#map'+id), {
            useCORS: true,
            onrendered: function(canvas) {
                var url = canvas.toDataURL();

                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/profile/canvastoimg',
                    data    : $.param({'data': url}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    var mapImage = result;

                    $('#mapconmain').html($('#mapcon'+id).html());


                    html2canvas($('#mapconmain'), {
                        useCORS: true,
                        onrendered: function(canvas) {
                            var url = canvas.toDataURL();

                            $http({
                                method: 'POST',
                                async:   false,
                                url: $scope.baseUrl+'/user/profile/canvastoimg1',
                                data    : $.param({'data': url}),
                                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                            }).success(function (result) {
                                var divImage = result;

                                $('#mapconmain').html('');

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs/imageMerge',
                                    data    : $.param({'image1':mapImage,'image2':divImage}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (res) {
                                    var shareImage = res;

                                    var sss = 'Tweet Compose';

                                    $scope.dialog2 = ngDialog.open({
                                        template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                        plain:true,
                                        closeByDocument: false,
                                        closeByEscape: false,
                                        scope: $scope
                                    });


                                });


                            });

                        }

                    });

                });

            }

        });
    }
    $scope.prShare = function(id){
        html2canvas($('#map'+id), {
            useCORS: true,
            onrendered: function(canvas) {
                var url = canvas.toDataURL();

                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/profile/canvastoimg',
                    data    : $.param({'data': url}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    var mapImage = result;

                    $('#mapconmain').html($('#mapcon'+id).html());


                    html2canvas($('#mapconmain'), {
                        useCORS: true,
                        onrendered: function(canvas) {
                            var url = canvas.toDataURL();

                            $http({
                                method: 'POST',
                                async:   false,
                                url: $scope.baseUrl+'/user/profile/canvastoimg1',
                                data    : $.param({'data': url}),
                                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                            }).success(function (result) {
                                var divImage = result;

                                $('#mapconmain').html('');

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs/imageMerge',
                                    data    : $.param({'image1':mapImage,'image2':divImage}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (res) {

                                    var shareImage = 'http://torqkd.com/fbshare/img/'+res;

                                    if($scope.isMobileApp=="com.torkqd"){
                                        window.location.href= "http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=";
                                    }else{
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");
                                    }


                                });


                            });

                        }

                    });

                });

            }

        });
    }

    $scope.postTw = function(value){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'routesImg';


        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/getTwOauth',
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                if($scope.isMobileApp){
                    window.location.href = ($scope.baseUrl+'/user/profile/twittershare2?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                }else{
                    window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                }
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter3.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $rootScope.twSmsg = 0;
                    $scope.showTwSucMsg();
                });
            }


        });



    }



    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }




});

homeControllers1.controller('eventDetCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,uiGmapGoogleMapApi) {
	$scope.sessUser = 0;
	$scope.evetId = $routeParams.id;
	$scope.evetDet = [];

	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	});
	
	$http({
		method: 'POST',
		async:   false,
		url: $scope.baseUrl+'/user/ajs/getEventDet',
		data    : $.param({'id':$routeParams.id}),
		headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
	}).success(function (result) {
        $scope.evetDet = result;
        $scope.map = {
            dragZoom: {options: {}},
            control:{},
            center: {
                latitude: result.latitude,
                longitude: result.longitude
            },
            pan: true,
            zoom: 12,
            refresh: false,
            events: {},
            bounds: {},
            markers: result.marker,
        };
	});



});

homeControllers1.controller('eventAddCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,uiGmapGoogleMapApi,$log,Upload) {
    $scope.sessUser = 0;
    $scope.heading = "Create Event";

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;
        }else{
            $location.path('/index');
        }
    });


    $scope.groupList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getgroupList',
    }).success(function (result) {
        $scope.groupList = result;
    });


    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getStateList',
    }).success(function (result) {
        $scope.statelist = result;
    });





    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };

    $scope.format = 'MM/dd/yyyy';

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

    $scope.selsp = function(){
        $('.activeimg').removeClass('activeimg');
    }



    $scope.eventImage = '';

    $scope.form = {
        end_time_hour: '12',
        end_time_min: '00',
        end_time_meridian: 'AM',
        start_time_hour: '12',
        start_time_min: '00',
        start_time_meridian: 'AM',
        sports_id: 0,
        image: '',
        all_day:0
    };


    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
            '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/eventUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/eventesizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+response.data+'?version='+ctime;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }






    $scope.submiteventForm = function() {
        if($scope.form.sports_id == 0){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Select A Sport</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else{
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/addevent',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.dialog = ngDialog.open({
                    template: '<div style="text-align:center;">Event Added Successfully</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $location.path('/profile/'+$scope.sessUser);
            });

        }

    };



});


homeControllers1.controller('eventEditCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,uiGmapGoogleMapApi,$log,Upload) {
    $scope.sessUser = 0;
    $scope.eventId = $routeParams.id;

    $scope.heading = "Edit Event";

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;
        }else{
            $location.path('/index');
        }
    });


    $scope.groupList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getgroupList',
    }).success(function (result) {
        $scope.groupList = result;
    });


    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getStateList',
    }).success(function (result) {
        $scope.statelist = result;
    });

    $scope.eventImage = '';

    $scope.form = {
        id: $scope.eventId,
        end_time_hour: '12',
        end_time_min: '00',
        end_time_meridian: 'AM',
        start_time_hour: '12',
        start_time_min: '00',
        start_time_meridian: 'AM',
        sports_id: 0,
        image: '',
        all_day:0
    };

    $scope.stateid = '';

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getEventDet',
        data    : $.param({'id':$scope.eventId}),  // pass in data as strings  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        if(data.id){
            angular.forEach($scope.statelist, function(val, key) {
                if(val['s_st_iso'] == data.state || val['name'] == data.state){
                    $scope.stateid = val['id'];
                    $scope.stateName = val['name'];
                }
            });
            $scope.form = {
                id: data.id,
                end_time_hour: '12',
                end_time_min: '00',
                end_time_meridian: 'AM',
                start_time_hour: '12',
                start_time_min: '00',
                start_time_meridian: 'AM',
                sports_id: data.sports_id,
                image: data.image,
                name: data.name,
                description: data.description,
                location: data.location,
                address: data.address,
                city: data.city,
                zip: data.zip,
                group_id:{
                    id: data.group_id
                },
                from_date1: data.from_date,
                from_date: data.from_date,
                to_date1: data.to_date,
                to_date: data.to_date,
                all_day: data.all_day,
                register_url: data.register_url,
                state:{
                    id: $scope.stateid,
                    name: $scope.stateName
                }
            };
            if(data.image)
                $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+data.image;
        }else{
           $location.path('/index');
        }

    });






    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };

    $scope.format = 'MM/dd/yyyy';

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

    $scope.selsp = function(){
        $('.activeimg').removeClass('activeimg');
    }


    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
            '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/eventUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/eventesizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+response.data+'?version='+ctime;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }



    $scope.submiteventForm = function() {
        if($scope.form.sports_id == 0){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Select A Sport</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else{
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/addevent',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.dialog = ngDialog.open({
                    template: '<div style="text-align:center;">Event Added Successfully</div>',
                    plain:true,
                    showClose:true,
                    closeByDocument: false,
                    closeByEscape: false
                });

                setTimeout(function(){
                    $scope.dialog.close();
                    $location.path('/profile/'+$scope.sessUser);
                },5000);
            });

        }

    };
    $scope.submiteventForm = function() {
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/editevent',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.dialog = ngDialog.open({
                    template: '<div style="text-align:center;">Event Updated Successfully</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $location.path('/profile/'+$scope.sessUser);
            });

    };



});



homeControllers1.controller('groupDetCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,uiGmapGoogleMapApi,$route) {
    $scope.sessUser = 0;
    $scope.groupId = $routeParams.id;
    $scope.groupDet = [];
    $scope.isLeaveGrp = 0;
    $scope.isMember = 0;
    $scope.isAdmin = 0;

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;
        }
    });


    $scope.bannerslides1 = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getBanner',
        data    : $.param({'pageid':4,'areaid':2,'sp_id':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.bannerslides1 = result;
    });

    $scope.bannerslides2 = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getBanner',
        data    : $.param({'pageid':4,'areaid':3,'sp_id':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.bannerslides2 = result;
    });

    $scope.openBanner = function(url){
        if($scope.isMobileApp){
            window.location.href = url;
        }else{
            window.open(url,'_blank');
        }
    }


    $scope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'members',
        url: 'members.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];

    $scope.currentTab = 'social.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }




    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getGroupDet',
        data    : $.param({'id':$routeParams.id}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        if(typeof result.id == 'undefined'){
            $location.path('/index/');
        }else{
            $scope.groupDet = result;
            $scope.isMember = result.is_member;
            if(jQuery.inArray( $scope.sessUser, result.admin ) >= 0){
                $scope.isAdmin = 1;
                $scope.settings =  {
                    title: 'settings',
                    url: 'settings.tpl.html'
                };

                $scope.tabs.splice(1,0,$scope.settings);

            }
            $scope.form = {
                id: result.id,
                name: result.name,
                description: result.description,
                notify:0
            }
        }
    });


    $scope.joingroup = function(id){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/joingroup',
            data    : $.param({'groupid':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result == 1){
                $scope.isMember = 1;
            }
        });
    }

    $scope.leavegroup = function(id){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/leavegroup',
            data    : $.param({'groupid':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result == 1){
                $scope.isMember = 0;
            }
        });
    }

    $scope.isStatusInput = 0;
    $scope.isRotateBtn = 0;
    $scope.photoval = '';
    $scope.videoval1 = '';
    $scope.videoval2 = '';
    $scope.isPhoto = 0;
    $scope.isVideo = 0;
    $scope.statusType = '';
    $scope.statusValue = '';
    $scope.statusText = '';
    $scope.shareVal = 1;
    $scope.group = 0;

    $scope.addPhoto = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isVideo = 0;
        $scope.isPhoto = 1;
        $scope.isStatusInput = 0;
    }

    $scope.addVideo = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 1;
        $scope.isStatusInput = 0;
    }

    $scope.cancelStatus = function(){
        $scope.isStatusInput = 0;
        $scope.isRotateBtn = 0;
        $scope.photoval = '';
        $scope.videoval1 = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;
        $scope.statusType = '';
        $scope.statusValue = '';
        $scope.statusText = '';
        $scope.shareVal = 1;
        $scope.group = 0;
    }


    $scope.statusList = [];
    $scope.groupMmber = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getgroupStatus',
        data    : $.param({'groupId':$scope.groupId,'offset':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.statusList = result.status;
        /* if(result.totalCount > $scope.statusList.length){
         $scope.viewMore = 1;
         $scope.offset = 5;
         }*/
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getgroupMember',
        data    : $.param({'groupId':$scope.groupId,'offset':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.groupMmber = result;
    });

    $scope.highchartsNG = [];
    $scope.chartdata = [];


    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getGroupStat',
        data    : $.param({'groupId':$scope.groupId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.stats = result;

        angular.forEach($scope.stats, function(val, key) {
            var highchartsNG = {
                options: {
                    chart: {
                        type: 'line'
                    }
                },
                series: [{
                    data: val.data,
                    name : '<div style="color:#555555;">Month</div>',
                    color : '#F79213'
                }],
                title: {
                    text: '<div style="color:#555555;">Last 6 Months</div>'
                },
                loading: false,

                xAxis: {
                    categories: val.mon
                },

                yAxis : {
                    title: {
                        text :  '<div style="color:#555555;">Activity</div>',
                    }
                },

                tooltip : {
                    valueSuffix : ''
                },
            }

            var chartdata = {
                sports_id : val.sports_id,
                sport_name : val.sport_name,
                imag_name : val.imag_name,
                activity_no : val.activity_no,
                total_dis : val.total_dis,
                total_time : val.total_time,
            }

            $scope.highchartsNG.push(highchartsNG);
            $scope.chartdata.push(chartdata);
        });


    });



    $scope.addFriend = function(item){
        var id = item.user_id;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/addconn',
            data    : $.param({'userid':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            item.frndship = 1;
        });
    }

    $scope.groupSettings = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/groupSettings',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $route.reload();
        });
    }

    $scope.addAsAdmin = function(item){
        var id = item.id;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs/addAsAdmin',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            item.is_admin = 1;
        });
    }




});



homeControllers1.controller('groupAddCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,Upload) {

    $scope.sessUser = 0;
    $scope.allCheck = 0;

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;
        }else{
            $location.path('/index');
        }
    });

    $scope.groupImage = '';

    $scope.form = {
        sports_id: 0,
        image: '',
        type: 1,
        users:[]
    };

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

    $scope.selsp = function(){
        $('.activeimg').removeClass('activeimg');
    }

    $scope.userList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/alluserList',
    }).success(function (result) {
        $scope.userList = result;
    });



    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
            '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/groupUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/groupResizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.groupImage = $scope.baseUrl+'/uploads/group_image/thumb/'+response.data+'?version='+ctime;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.userclick = function(id){
        var idx = $scope.form.users.indexOf(id);
        if (idx === -1) {
            $scope.form.users.push(id);
        }else{
            $scope.form.users.splice(idx,1);
        }
    }

    $scope.checkAll = function(){
        $scope.allCheck = 1;
        $scope.form.users=[];

        angular.forEach($scope.userList, function(val, key) {
            $scope.form.users.push(val.id);
        });
    }

    $scope.uncheckAll = function(){
        $scope.allCheck = 0;
        $scope.form.users=[];

    }


    $scope.addGroupForm = function(){

        if($scope.form.image == ''){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Upload Image</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else if($scope.form.sports_id == 0){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Select Sport</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else{
            $http({
             method  : 'POST',
             async:   false,
             url     : $scope.baseUrl+'/user/ajs/addGroup',
             data    : $.param($scope.form),  // pass in data as strings
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
             }) .success(function(data) {
                $location.path('/profile/'+$scope.sessUser);
             });
        }

    }



});


homeControllers1.controller('editProfileCtrl', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location,Upload) {

    $scope.sessUser = 0;
    $scope.userSports = [];
    $scope.profileImg = '';
    $scope.coverImg = '';
    $scope.profileImgName =  $scope.coverImgName = 'default.jpg';

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
    }) .success(function(data) {
        if(data > 0){
            $scope.sessUser = data;

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/getUserDetails',
                data    : $.param({'userid':data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(result) {

                $scope.form = {
                    id:result.id,
                    fname:result.fname,
                    lname:result.lname,
                    email:result.email,
                    location:result.location,
                    city:result.city,
                    state:{id:result.state},
                }

                $scope.userSports = result.user_sports;
                $scope.profileImg = result.profileImg;
                $scope.coverImg = result.backImg;
                $scope.profileImgName = result.profileImgName;
                $scope.coverImgName = result.backImgName;


            });



        }else{
            $location.path('/index');
        }
    });

    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/getStateList',
    }).success(function (result) {
        $scope.statelist = result;
    });

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });



    $scope.editProfile = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/updateProfile',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $location.path('/profile/'+$scope.sessUser);
        });
    }

    $scope.passwordValidator = function(password) {

        if(!password){return true;}

        if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }

        return true;
    };

    $scope.selsports = function(id){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/addDelsports',
            data    : $.param({'userid':$scope.sessUser,'sportid':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            var idx = $scope.userSports.indexOf(id);

            if(result ==1){
                if($scope.userSports.length){
                    $scope.userSports.push(id);
                }else{
                    $scope.userSports = [id];
                }
            }else{
                $scope.userSports.splice(idx,1);
            }
        });
    }

    $scope.profileImgDel = function(type){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs/profileImgDel',
            data    : $.param({'userid':$scope.sessUser,'type':type}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            if(type == 1){
                $scope.profileImg = result.imgSrc;
                $scope.profileImgName = result.imgName;
            }

            if(type==2){
                $scope.coverImg = result.imgSrc;
                $scope.coverImgName = result.imgName;
            }
        });
    }


    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
            '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/profileImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;

            $scope.profileImgName = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/profileimgresize',
                data    : $.param({'filename':response.data,'height':156,'width':142,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.profileImg = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data+'?version='+ctime;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    $scope.$watch('files1', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs/profileBackImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;

            $scope.coverImgName = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs/profileBackimgresize',
                data    : $.param({'filename':response.data,'height':536,'width':1175,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.coverImg = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data+'?version='+ctime;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }




});
homeControllers1.controller('comingsoon', function($scope, $http, $routeParams, $rootScope, ngDialog, $timeout,$location) {

	$scope.sessUser = 0;
	
	$http({
           method  : 'POST',
        async:   false,
           url     : $scope.baseUrl+'/user/ajs/getCurrentUser',
       }) .success(function(data) {
		   if(data > 0){
			   $scope.sessUser = data;
		   }
	   });


});