var params;

var xml = new XMLHttpRequest();
xml.responseType = 'json';
xml.onreadystatechange = function() {
    if (xml.readyState === XMLHttpRequest.DONE) {
        var training_data = xml.response;

        params = train(training_data);

        nn(4.5,1);

    }
}
xml.open('GET','data.json');
xml.send();

function sigmoid(x) {
  return 1/(1+Math.exp(-x));
}

function train(training_data) {
    var w1 = Math.random()*.2-.1;
    var w2 = Math.random()*.2-.1;
    var b = Math.random()*.2-.1;
    var learning_rate = 0.2;
    for(var iter =0; iter<50000; iter++) {
        // random point
        var random_id = Math.floor(Math.random() * training_data.length);
        var point = training_data[random_id];
        var target = point[2];

        // ff
        var z = point[0] * w1 + point[1] * w2 + b;
        var pred = sigmoid(z);

        // check
        var cost = (pred - target) ** 2;

        // slope sqrt
        var dcost_dpred = 2*(pred-target);

        // slope sigmoid
        var dpred_dz = sigmoid(z) * (1 - sigmoid(z));

        // w1,w2,b
        var dz_dw1 = point[0];
        var dz_dw2 = point[1];
        var dz_db = 1;

        // cost
        var dcost_dw1 = dcost_dpred*dpred_dz*dz_dw1;
        var dcost_dw2 = dcost_dpred*dpred_dz*dz_dw2;
        var dcost_db = dcost_dpred*dpred_dz*dz_db;

        // update
        w1 -= learning_rate*dcost_dw1;
        w2 -= learning_rate*dcost_dw2;
        b -= learning_rate*dcost_db;
    }
    return {w1,w2,b};
}

function nn(weight, muscle) {
    var output = sigmoid(weight * params.w1 + muscle * params.w2 + params.b);

    var elements = {
        weight: document.getElementById('weight'),
        muscle: document.getElementById('muscle'),
        w1: document.getElementById('w1'),
        w2: document.getElementById('w2'),
        nb: document.getElementById('nb'),
        b: document.getElementById('b'),
        calc: document.getElementById('calc'),
        test: document.getElementById('test'),
    }
    elements.weight.innerHTML = weight;
    elements.muscle.innerHTML = muscle;
    elements.w1.innerHTML = params.w1.toPrecision(5);
    elements.w2.innerHTML = params.w2.toPrecision(5);
    elements.nb.innerHTML = new Number(weight * params.w1 + muscle * params.w2).toPrecision(5);
    elements.b.innerHTML = params.b.toPrecision(5);
    elements.calc.innerHTML = new Number(weight * params.w1 + muscle * params.w2 + params.b).toPrecision(5);
    elements.test.innerHTML = output.toPrecision(5);

    return output;
}