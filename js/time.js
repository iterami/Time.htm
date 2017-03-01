'use strict';

function second(){
    if(!update_second){
        return;
    }

    var timestamp = time_timestamp_to_date();
    document.getElementById('timestamp-current').value = timestamp['timestamp'];

    document.getElementById('date').innerHTML = time_format_date({
      'date': timestamp,
    });
}

function update_date_inputs(date){
    for(var portion in date){
        document.getElementById(portion).value = time_two_digits({
          'number': date[portion],
        });
    }
}

var update_second = true;

window.onload = function(e){
    var now = time_timestamp_to_date();
    update_date_inputs(now);
    document.getElementById('timestamp').value = now['timestamp'];

    document.getElementById('date-to-timestamp').onclick = function(){
        var date = {
          'day': parseInt(document.getElementById('day').value, 10),
          'hour': parseInt(document.getElementById('hour').value, 10),
          'minute': parseInt(document.getElementById('minute').value, 10),
          'month': parseInt(document.getElementById('month').value, 10),
          'second': parseInt(document.getElementById('second').value, 10),
          'timezone': 0,
          'year': parseInt(document.getElementById('year').value, 10),
        };
        update_date_inputs(date);
        document.getElementById('timestamp').value = time_date_to_timestamp({
          'date': date,
        });
    };
    document.getElementById('now').onclick = function(){
        document.getElementById('timestamp').value = document.getElementById('timestamp-current').value;
    };
    document.getElementById('timestamp-to-date').onclick = function(){
        update_date_inputs(time_timestamp_to_date({
          'timestamp': parseInt(document.getElementById('timestamp').value, 10),
        }));
    };

    window.setInterval(
      second,
      1000
    );

    document.getElementById('timestamp-current').onblur =
      document.getElementById('timestamp-current').onfocus = function(e){
        update_second = !update_second;
    };
};
