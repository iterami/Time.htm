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
