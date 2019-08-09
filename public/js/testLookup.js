$(document).ready(function() {

    const injectParams = () => {
        const grade = +$('.grade-option').val();
        const date = $('.md-datepicker-input').val();
        const isValid = $('.validation-messages .ng-scope').val() === undefined;

        return isValid &&
        {
            grade: grade,
            date: date
        };
    };

    $('.btnLookup').on('click', () => {

        const info = injectParams();

        if (info)
            socket.emit('getTests', info);

    });

    const formatHTML = (info, i) => {
        const types = {
            'Q': 'Quiz',
            'T': 'Test',
            'B': 'Quiz & Test'
        }

        const heading = `<li><span class="test-heading">${info.subject}</span></li>`;
        const type = `<li>${types[info.type]}</li>`;

        const maxLen = prepareMaxLength;

        const main = info.prepare.substr(0, maxLen);
        let left;

        if (info.prepare.length > maxLen) {
            const other = info.prepare.substr(maxLen, info.prepare.length);
            left =
            `<li>
                ${main}<span class="dots" id="dots${i}">...</span><span class="more" id="more${i}">${other}<br><i>–${info.teacher}</i></span>
                <a href="#" class="btnMore" id="btnMore${i}" onclick="readMore(${i})">+</a>
            </li><br>`;
        } else {
            left = `<li>${main}</li>`;
        }

        return `${heading}<ul>${type}${left}</ul>`;
    };

    socket.on('recieveTests', tests => {

        const ls = $('.tests-list');
        ls.html('');

        if (tests[0].length) {

        } else {
            ls.append(`<h3>${noTestMsg}</h3>`);
        }

        for (let i in tests[0]) {
            ls.append(formatHTML(tests[0][+i], +i))
        }

        openPopupWin();

    });

});
