angular.module('shoppinpal.mobile-menu', [])
    .run(['$rootScope', '$spMenu', function($rootScope, $spMenu){
        $rootScope.$spMenu = $spMenu;
    }])
    .provider("$spMenu", function(){
        this.$get = [function(){
           var menu = {};

           menu.show = function show(){
               var menu = angular.element(document.querySelector('#sp-nav'));
               menu.addClass('show');
           };

           menu.hide = function hide(){
               var menu = angular.element(document.querySelector('#sp-nav'));
               menu.removeClass('show');
               angular.element('#sp-page').show();
           };

           menu.toggle = function toggle() {
               var menu = angular.element(document.querySelector('#sp-nav'));
               menu.toggleClass('show');
               var divh = angular.element('#sp-nav').height();
                   if(angular.element('#sp-nav').hasClass('show')){
                      // angular.element('#sp-nav').css('height',divh);
                      // angular.element('#sp-page').css('height',divh);
                       angular.element('#sp-page').hide();
                   }else{
                      // angular.element('#sp-nav').css('height','auto');
                      // angular.element('#sp-page').css('height','auto');
                       angular.element('#sp-page').show();
                   }
           };

           return menu;
        }];
    });