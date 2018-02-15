(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
            delete localStorage['selected_pizzas'];
            c_orders.push(Date.now() + 20*60*1000);
            localStorage['current_orders'] = JSON.stringify(c_orders);
            // save form data;
            if ($('#save-info').val() == "on") {
                var formData = {
                    firstName: $('#firstName').val(),
                    lastName: $('#lastName').val(),
                    email: $('#email').val(),
                    address: $('#address').val(),
                    address2: $('#address2').val(),
                    country: $('#country').val(),
                    State: $('#State').val(),
                    zip: $('#zip').val(),
                    credit: $('#credit').val(),
                    debit: $('#debit').val(),
                    cash: $('#cash').val(),
                    paypal: $('#paypal').val()
                };
                console.log(formData);
                localStorage['saved_data_form'] = JSON.stringify(formData);
            }
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

var c_orders = [];
if (typeof localStorage['current_orders'] != 'undefined') c_orders = JSON.parse(localStorage['current_orders']);

// start check

var s_pizzas = {};
var check = true;

if (typeof localStorage['selected_pizzas'] != 'undefined') {
    s_pizzas = JSON.parse(localStorage['selected_pizzas']);
} else {
    check = false;
}

function count(obj) {
    var n = 0;
    for (var i in obj) {if(new Number(obj[i]) > 0) n++;}
    return n;
}
function xcount(obj) {
    var n = 0;
    for (var i in obj) { n+=new Number(obj[i]);}
    return n;
}

if (count(s_pizzas) == 0) {
    check = false;
}

// current orders

function getTimeString(order){
    var diff = order - Date.now();
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    var timeString = '';
    if (hh > 0) {
        if (hh < 10) {
            timeString += 0+hh.toString();
        } else {
            timeString += hh.toString();
        }
        timeString += ':';
    }

    if (mm < 10) {
        timeString += 0+mm.toString();
    } else {
        timeString += mm.toString();
    }
    timeString += ':';
    
    if (ss < 10) {
        timeString += 0+ss.toString();
    } else {
        timeString += ss.toString();
    }
    return timeString;
}

if (c_orders.length > 0) {
    if (check == false) {
        $('#info').hide();
    }
    var only_once = true;
    for (var i in c_orders) {
        var order = c_orders[i]
        if(typeof order == "number") {

            $('#orders').append($('<div id="oorder'+i+'"/>').addClass('alert alert-warning my-4').html('Your order#'+i+' will be delivered within <strong id="order'+i+'">'+getTimeString(order)+'</strong>'));

            if (only_once) {
                only_once = false;
                setInterval(function() {
                    for (var i in c_orders) {
                        var order = c_orders[i]
                        if(typeof order == "number") {

                            var diff = order - Date.now();
                            if (diff < 0) {
                                c_orders.splice(i,1);
                                localStorage['current_orders'] = JSON.stringify(c_orders);
                                $('#oorder'+i).remove();
                                if (c_orders.length == 0 && check == false) {
                                    $('#info').show();
                                }
                            } else {
                                $('#order'+i).html(getTimeString(order));
                            }
                        }
                    }
                },1000);
            }
        }
    }
}

// good-to-go
// fixxx
if (check) {
    $('#info').remove();
} else {
    $('#checkout').remove();
}

$('#pizzasCount').html(xcount(s_pizzas));

var totalCost;
var costs = [];
var pizzas = [];
$.ajax({
    url: 'db.json',
    type: "GET",
    success (res) {
        costs = res.costs;
        pizzas = res.pizzas;
        totalCost = 0;
        for (var name in s_pizzas) {
            if (new Number(s_pizzas[name]) > 0) {
                var cnt = s_pizzas[name];
                var pid = pizzas.indexOf(name);
                var cost = costs[pid];
                $('#pizzas')
                .append($('<li/>').addClass('list-group-item d-flex justify-content-between lh-condensed')
                    .append($('<div/>')
                        .append($('<h6/>').addClass('my-0').html(name))
                    )
                    .append($('<span/>').addClass('text-muted').html(cnt+' <i class="fa fa-times"></i> $'+cost))
                );
                totalCost += cnt * new Number(cost);
            }
        }
        $('#pizzas')
            .append($('<li/>').addClass('list-group-item d-flex justify-content-between')
                .append($('<span/>').html('Total (USD)'))
                .append($('<strong/>').html('$'+totalCost.toLocaleString('en')))
        );
    },
    error (err) {
        console.log(err.responseText);
    }
})

// fill form
if (check && typeof localStorage['saved_data_form'] != 'undefined') {
    var formData = JSON.parse(localStorage['saved_data_form']);
    for (var id in formData) {
        $('#'+id).val(formData[id]);
    }
}