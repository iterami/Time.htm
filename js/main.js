'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'date-to-timestamp': {
          'onclick': function(){
              let timestamp = time_from_inputs();
              update_times(timestamp);
              update_date_inputs(timestamp_to_date({
                'timestamp': timestamp,
              }));
          },
        },
        'now': {
          'onclick': function(){
              update_times(Number(document.getElementById('timestamp-current').value));
          },
        },
        'timestamp-to-date': {
          'onclick': function(){
              update_times(Number.parseInt(document.getElementById('timestamp').value, 10));
          },
        },
      },
      'title': 'Time.htm',
    });

    update_times(timestamp_to_date()['timestamp']);

    core_interval_modify({
      'id': 'time',
      'interval': 1000,
      'sync': true,
      'todo': update,
    });
}
