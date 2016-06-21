function setValue(obj){

    $('#lat').val(obj);

}

function setValuelong(obj){

    $('#long').val(obj);

}



function add_userdevice_with_session(deviceId){
    $.post('http://torqkd.com/user/ajs/add_userdevice_with_session',{deviceId:deviceId},function(res){
       //alert(deviceId);
    });
}

function loadImage(imgPath){
     //alert( imgPath);
       /* var imgpatharr = imgPath.split(",");
        //alert(imgpatharr[1]);
        $('#localtestimg').attr('src', '\ file://'+imgpatharr[1]+"\ ");*/
       // $('#localtestimgstr').html(imgPath);
}


$(document).ready(function() {

    (function($){

        $.extend({

            APP : {

                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }
                    return a;
                },

                startTimer : function(dir) {

                    var a;

                    // save type
                    $.APP.dir = dir;

                    // get current date
                    $.APP.d1 = new Date();

                    switch($.APP.state) {

                        case 'pause' :

                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.APP.t1 = $.APP.d1.getTime() - $.APP.td;

                            break;

                        default :

                            // get current timestamp (for calculations)
                            $.APP.t1 = $.APP.d1.getTime();

                            // if countdown add ms based on seconds in textfield
                            if ($.APP.dir === 'cd') {
                                $.APP.t1 += parseInt($('#cd_seconds').val())*1000;
                            }

                            break;

                    }

                    // reset state
                    $.APP.state = 'alive';
                    $('#' + $.APP.dir + '_status').html('Running');

                    // start loop
                    $.APP.loopTimer();

                },

                pauseTimer : function() {

                    // save timestamp of pause
                    $.APP.dp = new Date();
                    $.APP.tp = $.APP.dp.getTime();

                    // save elapsed time (until pause)
                    $.APP.td = $.APP.tp - $.APP.t1;

                    // change button value
                    $('#' + $.APP.dir + '_start').val('Resume');

                    // set state
                    $.APP.state = 'pause';
                    $('#' + $.APP.dir + '_status').html('Paused');

                },

                stopTimer : function() {

                    // change button value
                    $('#' + $.APP.dir + '_start').val('Restart');

                    // set state
                    $.APP.state = 'stop';
                    $('#' + $.APP.dir + '_status').html('Stopped');

                },

                resetTimer : function() {

                    // reset display
                    $('#' + $.APP.dir + '_ms,#' + $.APP.dir + '_s,#' + $.APP.dir + '_m,#' + $.APP.dir + '_h').html('00');

                    // change button value
                    $('#' + $.APP.dir + '_start').val('Start');

                    // set state
                    $.APP.state = 'reset';
                    $('#' + $.APP.dir + '_status').html('Reset & Idle again');

                },

                endTimer : function(callback) {

                    // change button value
                    $('#' + $.APP.dir + '_start').val('Restart');

                    // set state
                    $.APP.state = 'end';

                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }

                },

                loopTimer : function() {

                    var td;
                    var d2,t2;

                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;

                    if ($.APP.state === 'alive') {

                        // get current date and convert it into
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();

                        // calculate time difference between
                        // initial and current timestamp
                        if ($.APP.dir === 'sw') {
                            td = t2 - $.APP.t1;
                            // reversed if countdown
                        } else {
                            td = $.APP.t1 - t2;
                            if (td <= 0) {
                                // if time difference is 0 end countdown
                                $.APP.endTimer(function(){
                                    $.APP.resetTimer();
                                    $('#' + $.APP.dir + '_status').html('Ended & Reset');
                                });
                            }
                        }

                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }
                                }
                            }
                        }

                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);

                        // update display
                        $('#' + $.APP.dir + '_ms').html($.APP.formatTimer(ms));
                        $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
                        $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
                        $('#' + $.APP.dir + '_h').html($.APP.formatTimer(h));

                        $('#hour').val($.APP.formatTimer(h));
                        $('#min').val($.APP.formatTimer(m));
                        $('#sec').val($.APP.formatTimer(s));

                        // loop
                        $.APP.t = setTimeout($.APP.loopTimer,1);

                    } else {

                        // kill loop
                        clearTimeout($.APP.t);
                        return true;

                    }

                }

            }

        });



    })(jQuery);

});

/*
var items = $('#items');
var index = 0;
var timeout;


(function($) {

    /**
     * Továbbítás a következő elemhez.
     */
   /* function autoForward() {

        var children = $('#spItems').children();

        var curIndex = $("#spItems li").index($("#spItems").find('li.cTop'));

        index = curIndex === children.length - 3 ? 0 : curIndex + 1;

        if ($('#spItems').length > 0) {
            animate25(children.eq(index));
        }else{
            setTimeout(function(){
                start123();
            },2000);
        }
    }

    /**
     * Indítjuk a következő elemhez ugrást.
     */
   /* function startTimer() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(autoForward, 5000);
    }

    /**
     * Animáljuk a dobozt a megadott elemhez.
     */
   /* function animate25(item) {

        if($('#spItems').length > 0){
                if (timeout) {
                    clearTimeout(timeout);
                }

                $('#spItems').find('li').removeClass('cTop');
                item.addClass('cTop');

                var firstContent = $('#spItems').find('li:first').html();


                $('#spItems').stop(true).animate({
                    top: -($('#spItems').find('li:first').position().top)
                }, 'slow', startTimer);

                $('#spItems').find('li:first').remove();
                $('#spItems').append('<li class="ng-scope">' + firstContent + '</li>');

    }else{
            setTimeout(function(){
                start123();
            },2000);
        }

    }



    start567();

    function start567(){
        alert($('#spItems').length);
        if($('#spItems').length > 0){
            var children = $('#spItems').children();

            alert(5);

            start123();
        }else{
            setTimeout(function(){
                start567();
            },2000);
        }
    }

    function start123(){
        var children = $('#spItems').children();

        if(children.length == 0){

            setTimeout(function(){
                start123();
            },2000);

        }else{
            if(children.length > 3){
                startTimer();
            }
        }

    }

}(jQuery));
*/
function showandmsg(msg){
    alert(msg);
    Android.showToast(msg);
 }