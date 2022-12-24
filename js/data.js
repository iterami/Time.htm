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
          'date': timestamp_to_date({
            'timestamp': entity_entities[args['label']]['target'],
          }),
        })
        + '<td><input checked type=checkbox><input id="' + args['label'] + '-button" type=button value=X>'
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

function update(){
    const time = new Date().getTime();
    const timezone = globalThis.isNaN(core_storage_data['timezone'])
      ? 0
      : Number(core_storage_data['timezone']) * 3600000;

    const timestamp = timestamp_to_date({
      'timestamp': time + timezone,
    });
    document.getElementById('timestamp-current').value = timestamp['timestamp'];

    document.getElementById('date-display').textContent = time_format({
      'date': timestamp,
    });

    const target = document.getElementById('timestamp').value;
    document.getElementById('diff').textContent = time_diff({
      'target': target,
    });
    const diff = timestamp['timestamp'] - target;
    const diffs = {
      'days': 86400000,
      'weeks': 604800000,
      'months': 2592000000,
      'years': 31556908800,
    };
    for(const id in diffs){
        document.getElementById('diff-' + id).textContent = core_number_format({
          'number': -diff / diffs[id],
        });
    }

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
        audio_start({
          'id': 'alarm',
        });
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
    document.getElementById('timestamp').value = timestamp;
    document.getElementById('timestamp-seconds').value = Math.floor(timestamp / 1000);

    update_date_inputs(timestamp_to_date({
      'timestamp': timestamp,
    }));
}
