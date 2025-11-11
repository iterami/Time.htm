'use strict';

function alarm_audio_init(){
    audio_create({
      'alarm': {
        'duration': .5,
        'frequency': core_storage_data.alarm_frequency,
      },
    });
}

function alarm_clear(event){
    const alarm = event.target.id.split('-')[0];
    if(!globalThis.confirm('Remove "' + alarm + '"?')){
        return;
    }

    core_elements.alarms_table.removeChild(
      event.target.parentElement.parentElement
    );

    entity_remove({
      'entities': [
        alarm,
      ],
    });
    delete core_elements[alarm];

    core_storage_data.alarms = JSON.stringify(entity_entities);
    core_storage_update();
}

function alarm_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'label': core_elements.alarm_label.value,
        'remake': false,
        'target': date_to_timestamp() + Number.parseInt(core_elements.alarm_seconds.value, 10) * 1000,
      },
    });

    if(!args.remake
      && JSON.parse(core_storage_data.alarms)[args.label]){
        return;
    }

    entity_create({
      'id': args.label,
      'properties': {
        'label': args.label,
        'target': args.target,
      },
      'types': [
        'alarm',
      ],
    });

    core_elements.alarms_table.insertAdjacentHTML(
      'beforeend',
      '<tr id="' + args.label + '">'
        + '<td>' + args.label
        + '<td>'
        + '<td>' + time_format({
          'date': timestamp_to_date(entity_entities[args.label].target),
        })
        + '<td><input checked type=checkbox><button id="' + args.label + '-button" type=button>X</button>'
    );
    document.getElementById(args.label + '-button').onclick = alarm_clear;
    core_elements[args.label] = document.getElementById(args.label);

    core_storage_data.alarms = JSON.stringify(entity_entities);
    core_storage_update();

    alarm_audio_init();
}

function repo_escape(){
    if(entity_info.alarm.count > 0){
        alarm_audio_init();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            if(entity_info.alarm.count <= 0){
                core_elements.alarms.value = '{}';
            }
        }
      },
      'events': {
        'add_alarm': {
          'onclick': function(){
              alarm_create();
          },
        },
        'date_to_timestamp': {
          'onclick': function(){
              update_times(time_from_inputs());
          },
        },
        'now': {
          'onclick': function(){
              update_times(Number(core_elements.timestamp_current.value));
          },
        },
        'timestamp_to_date': {
          'onclick': function(){
              update_times(Number(core_elements.timestamp.value));
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
        'alarm_frequency': 666,
        'timezone': 0,
      },
      'storage_menu': '<textarea id=alarms></textarea><br>'
        + '<table><tr><td><input class=mini id=alarm_frequency step=any type=number><td>Alarm Frequency</table>',
      'title': 'Time.htm',
      'ui_elements': [
        'alarm_label',
        'alarm_seconds',
        'alarms_table',
      ],
    });
    entity_set({
      'default': true,
      'type': 'alarm',
    });

    const alarms = JSON.parse(core_storage_data.alarms);
    for(const alarm in alarms){
        alarm_create({
          'label': alarms[alarm].label,
          'remake': true,
          'target': alarms[alarm].target,
        });
    }
    let calendar = '';
    for(let week = 0; week < 6; week++){
        calendar += '<tr>';
        for(let day = 0; day < 7; day++){
            calendar += '<td id=calendar_' + ((week * 7) + day) + '>';
        }
    }
    document.getElementById('calendar').innerHTML = calendar;
    for(let day = 0; day < 42; day++){
        core_elements['calendar_' + day] = document.getElementById('calendar_' + day);
    }

    update_times(timestamp_to_date().timestamp);
    core_interval_modify({
      'id': 'time',
      'interval': 1000,
      'sync': true,
      'todo': update,
    });
}

function update(){
    const time = new Date().getTime();
    const timezone = globalThis.isNaN(core_storage_data.timezone)
      ? 0
      : Number(core_storage_data.timezone) * 3600000;

    const timestamp = timestamp_to_date(time + timezone);
    const date_display = time_format({
      'date': timestamp,
    });
    document.title = date_display;

    const diff = timestamp.timestamp - core_elements.timestamp.value;

    core_ui_update({
      'ids': {
        'date_display': date_display,
        'diff': time_diff({
          'target': core_elements.timestamp.value,
        }),
        'diff_days': core_number_format({
          'number': -diff / 86400000,
        }),
        'diff_months': core_number_format({
          'number': -diff / 2592000000,
        }),
        'diff_weeks': core_number_format({
          'number': -diff / 604800000,
        }),
        'diff_years': core_number_format({
          'number': -diff / 31556908800,
        }),
        'timestamp_current': timestamp.timestamp,
      },
    });

    let play_alarm_sound = false;
    entity_group_modify({
      'groups': [
        'alarm',
      ],
      'todo': function(entity){
          const remaining = (entity_entities[entity].target - date_to_timestamp()) / 1000;

          core_elements[entity].childNodes[1].textContent = time_diff({
            'target': remaining * 1000 + date_to_timestamp(),
          });

          if(remaining < 0){
              core_elements[entity].style.backgroundColor = '#f00';

              if(core_elements[entity].childNodes[3].childNodes[0].checked){
                  play_alarm_sound = true;
              }
          }
      },
    });

    if(play_alarm_sound){
        audio_start('alarm');
    }
}

function update_times(timestamp){
    const date = timestamp_to_date(timestamp);
    const calendar = {};
    const month = date.month === 0 ? 11 : date.month - 1;
    const month_end = new Date(date.year, date.month, 0).getDate();
    const month_start_day = new Date(date.year, month, 1).getDay();
    const month_start = month_start_day === 0
      ? 6
      : month_start_day - 1;
    const previous_end = new Date(date.year, month, 0).getDate();
    for(let day = 0; day < 42; day++){
        let value = '';
        let style = '#000';
        if(day < month_start){
            value = previous_end - (month_start - day) + 1;

        }else{
            const adjusted = day - month_start + 1;
            if(adjusted > month_end){
                value = adjusted - month_end;

            }else if(adjusted === date.date){
                style = '#333';
                value = '[' + adjusted + ']';

            }else{
                style = '#111';
                value = adjusted;
            }
        }
        core_elements['calendar_' + day].style.backgroundColor = style;
        calendar['calendar_' + day] = value;
    }
    core_ui_update({
      'ids': {
        'date': core_digits_min({
          'number': date.date,
        }),
        'hour': core_digits_min({
          'number': date.hour,
        }),
        'leap': date.year + ' is ' + (((date.year & 3) === 0 && (date.year % 25 !== 0 || (date.year & 15) === 0))
          ? ''
          : 'NOT'),
        'minute': core_digits_min({
          'number': date.minute,
        }),
        'month': core_digits_min({
          'number': date.month,
        }),
        'month_name': ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',][date.month],
        'second': core_digits_min({
          'number': date.second,
        }),
        'timestamp': timestamp,
        'timestamp_seconds': Math.floor(timestamp / 1000),
        'year': date.year,
        ...calendar,
      },
    });
}
