function setCookie(cname, cval, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    const expires = d.toUTCString();

    return document.cookie = `${cname}=${cval};expires=${expires};path='/'`;
}

function getCookie(cname) {
    const r = new RegExp(cname + '=(\\w+)');
    const a = document.cookie.match(r);

    return a ? a[1] : 0;
}
