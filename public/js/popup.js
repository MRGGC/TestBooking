function openPopupWin() {
    $('.overlay').css({'visibility': 'visible'});
    $('.overlay').animate({'opacity': 1}, popupSpeed);
}

function closePopupWin() {
    $('.overlay').css({'visibility': 'hidden'});
    $('.overlay').css({'opacity': 0});
}

function readMore(i) {

    const btn = $('#btnMore'+i);

    if (btn.html() === '+') {
        btn.html('-');
        $('#dots'+i).css({'display':'none'});
        $('#more'+i).css({'display':'inline'});
    } else {
        btn.html('+');
        $('#dots'+i).css({'display':'inline'});
        $('#more'+i).css({'display':'none'});
    }

}
