'use strict';

function date_to_timestamp(){
    var converted = new Date(
      parseInt(document.getElementById('year').value),
      parseInt(document.getElementById('month').value) - 1,
      parseInt(document.getElementById('day').value),
      parseInt(document.getElementById('hour').value),
      parseInt(document.getElementById('minute').value),
      parseInt(document.getElementById('second').value)
    );
    document.getElementById('timestamp-input').value = Math.floor(converted.getTime() / 1000);
}

function second(){
    if(!update_second){
        return;
    }

    document.getElementById('timestamp').value = Math.floor(new Date().getTime() / 1000);
}

function timestamp_to_date(){
    var converted = new Date(parseFloat(document.getElementById('timestamp-input').value * 1000));
    update_date_inputs(converted);
}

function two_digits(time){
    if(time < 10){
        return '0' + time;
    }
    return time;
}

function update_date_inputs(date){
    document.getElementById('day').value = two_digits(date.getDate());
    document.getElementById('hour').value = two_digits(date.getHours());
    document.getElementById('minute').value = two_digits(date.getMinutes());
    document.getElementById('month').value = two_digits(date.getMonth() + 1);
    document.getElementById('second').value = two_digits(date.getSeconds());
    document.getElementById('year').value = date.getFullYear();
}

var update_second = true;

document.getElementById('timestamp').onblur = function(e){
    update_second = true;
};

document.getElementById('timestamp').onfocus = function(e){
    update_second = false;
};

window.onload = function(e){
    var now = new Date();
    update_date_inputs(now);
    document.getElementById('timestamp-input').value = Math.floor(now.getTime() / 1000);

    window.setInterval(
      'second()',
      1000
    );
};
