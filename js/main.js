'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'date-to-timestamp': {
          'onclick': function(){
              update_times(time_from_inputs());
          },
        },
        'now': {
          'onclick': function(){
              document.getElementById('timestamp').value = document.getElementById('timestamp-current').value;
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
      'interval': 100,
      'todo': update,
    });
}
