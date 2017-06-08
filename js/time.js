'use strict';

function repo_init(){
    core_repo_init({
      'title': 'Time.htm',
    });

    var now = time_timestamp_to_date();
    update_date_inputs(now);
    document.getElementById('timestamp').value = now['timestamp'];

    document.getElementById('date-to-timestamp').onclick = function(){
        var date = time_from_inputs();
        document.getElementById('timestamp').value = date;
        update_date_inputs(time_timestamp_to_date({
          'timestamp': date,
        }));
    };
    document.getElementById('now').onclick = function(){
        document.getElementById('timestamp').value = document.getElementById('timestamp-current').value;
    };
    document.getElementById('timestamp-to-date').onclick = function(){
        var timestamp = parseInt(document.getElementById('timestamp').value, 10);
        if(isNaN(timestamp)){
            timestamp = 0;
        }

        update_date_inputs(time_timestamp_to_date({
          'timestamp': timestamp,
        }));
    };

    window.setInterval(
      update,
      100
    );

    document.getElementById('timestamp-current').onblur =
      document.getElementById('timestamp-current').onfocus = function(e){
        update_second = !update_second;
    };
}

function update(){
    if(!update_second){
        return;
    }

    var timestamp = time_timestamp_to_date();
    document.getElementById('timestamp-current').value = timestamp['timestamp'];

    document.getElementById('date-display').innerHTML = time_format_date({
      'date': timestamp,
    });
}

function update_date_inputs(date){
    for(var portion in date){
        var element = document.getElementById(portion);
        if(element){
            element.value = time_two_digits({
              'number': date[portion],
            });
        }
    }
}

var update_second = true;
