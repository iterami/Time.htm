'use strict';

function date_to_timestamp(){
    var converted = new Date(
      parseInt(document.getElementById('year').value),
      parseInt(document.getElementById('month').value) - 1,
      parseInt(document.getElementById('day').value),
      parseInt(document.getElementById('hour').value),
      parseInt(document.getElementById('minute').value),
      parseInt(document.getElementById('second').value)
    );
    document.getElementById('timestamp-input').value = Math.floor(converted.getTime() / 1000);
}

function second(){
    document.getElementById('timestamp').innerHTML = Math.floor(new Date().getTime() / 1000);
}

function timestamp_to_date(){
    var converted = new Date(parseFloat(document.getElementById('timestamp-input').value * 1000));
    update_date_inputs(converted);
}

function update_date_inputs(date){
    document.getElementById('day').value = date.getDate();
    document.getElementById('hour').value = date.getHours();
    document.getElementById('minute').value = date.getMinutes();
    document.getElementById('month').value = date.getMonth() + 1;
    document.getElementById('second').value = date.getSeconds();
    document.getElementById('year').value = date.getFullYear();
}

window.onload = function(e){
    var now = new Date();
    update_date_inputs(now);
    document.getElementById('timestamp-input').value = Math.floor(now.getTime() / 1000);

    window.setInterval(
      'second()',
      1000
    );
};
