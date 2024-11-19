'use strict';

function alarm_clear(event){
    const alarm = event.target.id.split('-')[0];
    if(!globalThis.confirm('Remove "' + alarm + '"?')){
        return;
    }

    core_elements['alarms-table'].removeChild(
      event.target.parentElement.parentElement
    );

    entity_remove({
      'entities': [
        alarm,
      ],
    });

    core_storage_data['alarms'] = JSON.stringify(entity_entities);
    core_storage_update();
}

function alarm_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'label': core_elements['alarm-label'].value,
        'remake': false,
        'target': date_to_timestamp() + Number.parseInt(core_elements['alarm-seconds'].value, 10) * 1000,
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

    core_elements['alarms-table'].insertAdjacentHTML(
      'beforeend',
      '<tr id="' + args['label'] + '">'
        + '<td>' + args['label']
        + '<td>'
        + '<td>' + time_format({
          'date': timestamp_to_date(entity_entities[args['label']]['target']),
        })
        + '<td><input checked type=checkbox><button id="' + args['label'] + '-button" type=button>X</button>'
    );
    document.getElementById(args['label'] + '-button').onclick = alarm_clear;

    core_storage_data['alarms'] = JSON.stringify(entity_entities);
    core_storage_update();
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(entity_info['alarm']['count'] <= 0){
                core_elements['alarms'].value = '{}';
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
        'alarm-frequency': 666,
        'timezone': 0,
      },
      'storage-menu': '<textarea id=alarms></textarea><br>'
        + '<table><tr><td><input class=mini id=alarm-frequency step=any type=number><td>Alarm Frequency</table>',
      'title': 'Time.htm',
      'ui-elements': [
        'alarm-label',
        'alarm-seconds',
        'alarms-table',
      ],
    });
    entity_set({
      'default': true,
      'type': 'alarm',
    });

    const alarms = JSON.parse(core_storage_data['alarms']);
    for(const alarm in alarms){
        alarm_create({
          'label': alarms[alarm]['label'],
          'remake': true,
          'target': alarms[alarm]['target'],
        });
    }
    let calendar = '<tr class=header><td>Monday<td>Tuesday<td>Wednesday<td>Thursday<td>Friday<td>Saturday<td>Sunday';
    for(let week = 0; week < 6; week++){
        calendar += '<tr>';
        for(let day = 0; day < 7; day++){
            calendar += '<td id="' + week + ',' + day + '">';
        }
    }
    document.getElementById('calendar').innerHTML = calendar;

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
    const timezone = globalThis.isNaN(core_storage_data['timezone'])
      ? 0
      : Number(core_storage_data['timezone']) * 3600000;

    const timestamp = timestamp_to_date(time + timezone);
    const date_display = time_format({
      'date': timestamp,
    });
    document.title = date_display;

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
        audio_create({
          'alarm': {
            'duration': .5,
            'frequency': core_storage_data['alarm-frequency'],
          },
        });
        audio_start('alarm');
    }
}

function update_times(timestamp){
    const date = timestamp_to_date(timestamp);
    const calendar = {};
    const month_end = new Date(date['year'], date['month'], 0).getDate();
    const month_start = new Date(date['year'] + '-' + date['month'] + '-01').getDay();
    for(let week = 0; week < 6; week++){
        for(let day = 0; day < 7; day++){
            const string = week + ',' + day;
            calendar[string] = '';

            let dayofmonth = week * 7 + day;
            if(dayofmonth < month_start){
                continue;
            }
            dayofmonth -= month_start - 1;
            if(dayofmonth > month_end){
                calendar[string] = dayofmonth - month_end;

            }else{
                calendar[string] = dayofmonth === date['date']
                  ? '[' + (dayofmonth) + ']'
                  : dayofmonth;
            }
        }
    }
    core_ui_update({
      'ids': {
        'date': core_digits_min({
          'number': date['date'],
        }),
        'hour': core_digits_min({
          'number': date['hour'],
        }),
        'leap': date['year'] + ' is ' + (((date['year'] & 3) === 0 && (date['year'] % 25 !== 0 || (date['year'] & 15) === 0))
          ? ''
          : 'NOT') + ' a leap year',
        'minute': core_digits_min({
          'number': date['minute'],
        }),
        'month': core_digits_min({
          'number': date['month'],
        }),
        'second': core_digits_min({
          'number': date['second'],
        }),
        'timestamp': timestamp,
        'timestamp-seconds': Math.floor(timestamp / 1000),
        'year': date['year'],
        ...calendar,
      },
    });
}
