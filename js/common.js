function setValue(obj){

    //alert(obj);

}

function setValuelong(obj){

    //alert(obj);

}




function add_userdevice_with_session(deviceId){
    $.post('http://torqkd.com/user/ajs/add_userdevice_with_session',{deviceId:deviceId},function(res){
       //alert(res);
    });
}

