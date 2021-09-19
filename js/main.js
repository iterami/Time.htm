'use strict';

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(entity_info['alarm']['count'] <= 0){
                document.getElementById('alarms').value = '{}';
            }

            core_storage_save();
        }
      },
      'events': {
        'add-alarm': {
          'onclick': function(){
              alarm_create();
          },
        },
        'date-to-timestamp': {
          'onclick': function(){
              update_times(time_from_inputs());
          },
        },
        'now': {
          'onclick': function(){
              update_times(Number(document.getElementById('timestamp-current').value));
          },
        },
        'timestamp-to-date': {
          'onclick': function(){
              update_times(Number(document.getElementById('timestamp').value));
          },
        },
        'timezone': {
          'oninput': core_storage_save,
        },
      },
      'storage': {
        'alarms': '{}',
        'timezone': 0,
      },
      'storage-menu': '<textarea id=alarms></textarea><br>',
      'title': 'Time.htm',
    });
    entity_set({
      'default': true,
      'type': 'alarm',
    });
    audio_create({
      'audios': {
        'alarm': {
          'duration': .5,
          'frequency': 666,
        },
      },
    });

    const alarms = JSON.parse(core_storage_data['alarms']);
    for(const alarm in alarms){
        alarm_create({
          'label': alarms[alarm]['label'],
          'remake': true,
          'target': alarms[alarm]['target'],
        });
    }
    update_times(timestamp_to_date()['timestamp']);

    core_interval_modify({
      'id': 'time',
      'interval': 1000,
      'sync': true,
      'todo': update,
    });
}
