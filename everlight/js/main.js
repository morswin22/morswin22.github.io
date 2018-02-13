$(function () {
    $('[data-toggle="popover"]').popover()
});

$('.carousel').carousel('cycle');

var fixDisplay = function(e) {
    $('._fix-display').each(function(i, elem){
        var $elem = $(elem);
        if (window.innerWidth <= 700) {
            $elem.hide();
        } else {
            $elem.show();
        }
    });
}

window.onresize = fixDisplay;
window.onload = fixDisplay;