function getTest(id) {
    for (let t of tests)
        if (t.test_id == id)
            return t;
}

function edit(id) {
    const test = getTest(id);

    if (test) {
        $(`.popup .section-heading`).html("Edit");
        $(`.popup .section-heading`).css("text-align", "center");

        $(`.popup textarea`).html(test.prepare);
        $(`.popup select[name="grade"]`).val(test.grade);
        $(`.popup select[name="type"]`).val(test.type);
        $(`.popup select[name="subject"]`).val(test.subject_id);
        $(`.popup .md-datepicker-input`).val(parseSQLdate(test.date));

        $(`.popup button[type="submit"]`).html("UPDATE TEST");
        $(`.popup form`).attr("action", "/update");
        $(`.popup form`).append(`<input type="hidden" name="test_id" value="${id}" />`)

        openPopupWin();
    }
}

function remove(id) {
    const del = confirm("Are you sure you want to delete this test?");

    if (del) {
        $.ajax({
            type: 'DELETE',
            url: '/remove',
            data: {id: id},
            success: function() {
                location.reload();
            }
        });
    }
}
