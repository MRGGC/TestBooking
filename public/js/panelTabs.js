function openTab(tabID) {
    tabID = tabID >= 0 && tabID <= 3 ? tabID : 0;

    for (let i = 0; i < 3; i++) {
        if (i === tabID) {
            $(`#tab${i}`).css("display", "block");
        } else {
            $(`#tab${i}`).css("display", "none");
        }
    }

    setCookie('tab', tabID, 9 * 31);
}

$(document).ready(() => {
    openTab(+getCookie('tab'));
});
