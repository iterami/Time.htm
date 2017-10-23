'use strict';

function repo_init(){
    core_repo_init({
      'globals': {
        'update_second': true,
      },
      'info-events': {
        'date-to-timestamp': {
          'todo': function(){
              update_times(time_from_inputs());
          },
        },
        'now': {
          'todo': function(){
              document.getElementById('timestamp').value = document.getElementById('timestamp-current').value;
          },
        },
        'timestamp-to-date': {
          'todo': function(){
              update_times(parseInt(document.getElementById('timestamp').value, 10));
          },
        },
      },
      'title': 'Time.htm',
    });

    update_times(time_timestamp_to_date()['timestamp']);

    window.setInterval(
      update,
      100
    );

    var element = document.getElementById('timestamp-current');
    element.onblur =
      element.onfocus = function(e){
        update_second = !update_second;
    };
}
