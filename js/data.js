'use strict';

function update(){
    let timestamp = timestamp_to_date();
    document.getElementById('timestamp-current').value = timestamp['timestamp'];

    document.getElementById('date-display').textContent = time_format({
      'date': timestamp,
    });

    let target = document.getElementById('timestamp').value;
    document.getElementById('diff').textContent = time_diff({
      'target': target,
    });
    let diff = timestamp['timestamp'] - target;
    let diffs = {
      'days': 86400000,
      'weeks': 604800000,
      'years': 31556908800,
    };
    for(let id in diffs){
        document.getElementById('diff-' + id).textContent = core_number_format({
          'number': diff / diffs[id],
        });
    }
}

function update_date_inputs(date){
    for(let portion in date){
        core_html_modify({
          'id': portion,
          'properties': {
            'value': core_digits_min({
              'number': date[portion],
            }),
          },
        });
    }
}

function update_times(timestamp){
    document.getElementById('timestamp').value = timestamp;
    document.getElementById('timestamp-seconds').value = Math.floor(timestamp / 1000);

    update_date_inputs(timestamp_to_date({
      'timestamp': timestamp,
    }));
}
