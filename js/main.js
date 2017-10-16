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
        update_times(parseInt(document.getElementById('timestamp').value, 10));
    };

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
