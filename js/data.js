'use strict';

function update(){
    const timestamp = timestamp_to_date();
    document.getElementById('timestamp-current').value = timestamp['timestamp'];

    document.getElementById('date-display').textContent = time_format({
      'date': timestamp,
    });

    const target = document.getElementById('timestamp').value;
    document.getElementById('diff').textContent = time_diff({
      'target': target,
    });
    const diff = timestamp['timestamp'] - target;
    const diffs = {
      'days': 86400000,
      'weeks': 604800000,
      'years': 31556908800,
    };
    for(const id in diffs){
        document.getElementById('diff-' + id).textContent = core_number_format({
          'number': diff / diffs[id],
        });
    }
}

function update_date_inputs(date){
    for(const portion in date){
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
