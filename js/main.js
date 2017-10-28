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
        'timestamp-current': {
          'onblur': function(){
              update_second = !update_second;
          },
          'onfocus': function(){
              update_second = !update_second;
          },
        },
        'timestamp-to-date': {
          'onclick': function(){
              update_times(parseInt(document.getElementById('timestamp').value, 10));
          },
        },
      },
      'globals': {
        'update_second': true,
      },
      'title': 'Time.htm',
    });

    update_times(time_timestamp_to_date()['timestamp']);

    core_interval_modify({
      'interval': 100,
      'todo': update,
    });
}
