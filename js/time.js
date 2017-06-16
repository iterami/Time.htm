'use strict';

function repo_init(){
    core_repo_init({
      'title': 'Time.htm',
    });

    update_times(time_timestamp_to_date()['timestamp']);

    document.getElementById('date-to-timestamp').onclick = function(){
        update_times(time_from_inputs());
    };
    document.getElementById('now').onclick = function(){
        document.getElementById('timestamp').value = document.getElementById('timestamp-current').value;
    };
    document.getElementById('timestamp-to-date').onclick = function(){
        update_times(parseInt(document.getElementById('timestamp').value));
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

function update_times(timestamp){
    document.getElementById('timestamp').value = timestamp;
    document.getElementById('timestamp-seconds').value = Math.floor(timestamp / 1000);

    update_date_inputs(time_timestamp_to_date({
      'timestamp': timestamp,
    }));
}

var update_second = true;
