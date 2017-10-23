'use strict';

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
        core_html_modify({
          'id': portion,
          'properties': {
            'value': date[portion],
          },
        });
    }
}

function update_times(timestamp){
    document.getElementById('timestamp').value = timestamp;
    document.getElementById('timestamp-seconds').value = Math.floor(timestamp / 1000);

    update_date_inputs(time_timestamp_to_date({
      'timestamp': timestamp,
    }));
}
