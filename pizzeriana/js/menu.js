function random(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

$.ajax({
    url: 'db.json',
    type: 'GET',
    success(res) { 
        costs = res.costs;
        m_pizzas = res.pizzas; 
        if (typeof localStorage['selected_pizzas'] != 'undefined') {
            s_pizzas = JSON.parse(localStorage['selected_pizzas']);
        }
        render();
        root.html('');
        for (var id in m_pizzas) {
            var name = m_pizzas[id];
            var cost = costs[id];
            var html = template.replace('pID',new Number(id)+1).replace('ID',id).replace('NAME',name).replace('COST',cost);
            if (typeof s_pizzas[name] == 'string') {
                var num = s_pizzas[name];
                html = html.replace('value="0"','value="'+num+'"');
            }
            root.append(html);
        }
        $('.pizza-counter').on('change', function(e) {
            var e = $(e.target);
            s_pizzas[m_pizzas[e.attr('data-id')]] = e.val();
            render();
        }); 
    },
    error(err) {
        console.log(err.responseText);
    }
})

var root = $('#menu'); 
var template = '<li class="list-group-item"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text">pID</span></div><div class="form-control" style="padding: 12px">NAME<span style="float: right;" class="mr-1">$COST</span></div><div class="input-group-append"><span class="input-group-text"><input type="number" min="0" value="0" class="form-control pizza-counter" data-id="ID"></span></div></div></li>';

var costs = [];
var m_pizzas = [];
var s_pizzas = {};

function count(obj) {
    var n = 0;
    for (var i in obj) {if(new Number(obj[i]) > 0) n++;}
    return n;
}

function render() {
    if (count(s_pizzas) == 0) {
        $('#info').html('Choose the pizza you want to eat to proceed').attr('class','alert alert-primary my-4');
    } else {
        $('#info').html('').attr('class','alert alert-success my-4')
            .append($('<a href="./orders.html" />').addClass('btn btn-success w-100').html('Confirm order'));
    }
    localStorage['selected_pizzas'] = JSON.stringify(s_pizzas);
}