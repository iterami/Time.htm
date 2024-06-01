'use strict';

function alarm_clear(element, id){
    document.getElementById('alarms-table').removeChild(
      element.parentElement.parentElement
    );

    entity_remove({
      'entities': [
        id,
      ],
    });

    core_storage_data['alarms'] = JSON.stringify(entity_entities);
    core_storage_update();
}

function alarm_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'label': document.getElementById('alarm-label').value,
        'remake': false,
        'target': date_to_timestamp() + Number.parseInt(document.getElementById('alarm-seconds').value, 10) * 1000,
      },
    });

    if(!args['remake']
      && JSON.parse(core_storage_data['alarms'])[args['label']]){
        return;
    }

    entity_create({
      'id': args['label'],
      'properties': {
        'label': args['label'],
        'target': args['target'],
      },
      'types': [
        'alarm',
      ],
    });

    document.getElementById('alarms-table').insertAdjacentHTML(
      'beforeend',
      '<tr id="' + args['label'] + '">'
        + '<td>' + args['label']
        + '<td>'
        + '<td>' + time_format({
          'date': timestamp_to_date(entity_entities[args['label']]['target']),
        })
        + '<td><input checked type=checkbox><button id="' + args['label'] + '-button" type=button>X</button>'
    );
    document.getElementById(args['label'] + '-button').onclick = function(){
        alarm_clear(
          this,
          args['label']
        );
    };

    core_storage_data['alarms'] = JSON.stringify(entity_entities);
    core_storage_update();
}

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
              update_times(Number(core_elements['timestamp-current'].value));
          },
        },
        'timestamp-to-date': {
          'onclick': function(){
              update_times(Number(core_elements['timestamp'].value));
          },
        },
        'timezone': {
          'oninput': function(){
              core_storage_save([
                'timezone',
              ]);
          },
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

function update(){
    const time = new Date().getTime();
    const timezone = Number.isNaN(core_storage_data['timezone'])
      ? 0
      : Number(core_storage_data['timezone']) * 3600000;

    const timestamp = timestamp_to_date(time + timezone);
    const date_display = time_format({
      'date': timestamp,
    });
    document.title = date_display + ' - ' + core_repo_title;

    const diff = timestamp['timestamp'] - core_elements['timestamp'].value;

    core_ui_update({
      'ids': {
        'date-display': date_display,
        'diff': time_diff({
          'target': core_elements['timestamp'].value,
        }),
        'diff-days': core_number_format({
          'number': -diff / 86400000,
        }),
        'diff-months': core_number_format({
          'number': -diff / 2592000000,
        }),
        'diff-weeks': core_number_format({
          'number': -diff / 604800000,
        }),
        'diff-years': core_number_format({
          'number': -diff / 31556908800,
        }),
        'timestamp-current': timestamp['timestamp'],
      },
    });

    let play_alarm_sound = false;
    entity_group_modify({
      'groups': [
        'alarm',
      ],
      'todo': function(entity){
          const element = document.getElementById(entity);
          const remaining = (entity_entities[entity]['target'] - date_to_timestamp()) / 1000;

          element.childNodes[1].textContent = time_diff({
            'target': remaining * 1000 + date_to_timestamp(),
          });

          if(remaining < 0){
              element.style.backgroundColor = '#f00';

              if(element.childNodes[3].childNodes[0].checked){
                  play_alarm_sound = true;
              }
          }
      },
    });

    if(play_alarm_sound){
        audio_start('alarm');
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
    core_ui_update({
      'ids': {
        'timestamp': timestamp,
        'timestamp-seconds': Math.floor(timestamp / 1000),
      },
    });
    update_date_inputs(timestamp_to_date(timestamp));
}
