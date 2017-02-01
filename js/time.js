'use strict';

function create_date(timestamp){
    var date = new Date(timestamp * 1000);
    return {
      'day': two_digits(date.getUTCDate()),
      'hour': two_digits(date.getUTCHours()),
      'minute': two_digits(date.getUTCMinutes()),
      'month': two_digits(date.getUTCMonth() + 1),
      'second': two_digits(date.getUTCSeconds()),
      'year': date.getUTCFullYear(),
    };
}

function date_to_timestamp(){
    var converted = new Date(
      Date.UTC(
        parseInt(document.getElementById('year').value, 10),
        parseInt(document.getElementById('month').value, 10) - 1,
        parseInt(document.getElementById('day').value, 10),
        parseInt(document.getElementById('hour').value, 10),
        parseInt(document.getElementById('minute').value, 10),
        parseInt(document.getElementById('second').value, 10)
      )
    );
    document.getElementById('timestamp-input').value = Math.floor(converted.getTime() / 1000);
}

function now_update(){
    document.getElementById('timestamp-input').value = document.getElementById('timestamp').value;
}

function second(){
    if(!update_second){
        return;
    }

    var timestamp = Math.floor(new Date().getTime() / 1000);
    document.getElementById('timestamp').value = timestamp;

    var date = create_date(timestamp);
    document.getElementById('date').innerHTML =
      + date['year'] + '-'
      + date['month'] + '-'
      + date['day'] + ' '
      + date['hour'] + ':'
      + date['minute'] + ':'
      + date['second'];
}

function timestamp_to_date(){
    var converted = new Date(parseInt(
      document.getElementById('timestamp-input').value,
      10
    ));
    update_date_inputs(create_date(converted));
}

function two_digits(time){
    if(time < 10){
        return '0' + time;
    }
    return time;
}

function update_date_inputs(date){
    for(var portion in date){
        document.getElementById(portion).value = date[portion];
    }
}

var update_second = true;

window.onload = function(e){
    var now = new Date();
    update_date_inputs(create_date(now / 1000));
    document.getElementById('timestamp-input').value = Math.floor(now.getTime() / 1000);

    document.getElementById('date-to-timestamp').onclick = date_to_timestamp;
    document.getElementById('now').onclick = now_update;
    document.getElementById('timestamp-to-date').onclick = timestamp_to_date;

    window.setInterval(
      second,
      1000
    );

    document.getElementById('timestamp').onblur =
      document.getElementById('timestamp').onfocus = function(e){
        update_second = !update_second;
    };
};
