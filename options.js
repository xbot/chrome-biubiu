function RestoreSettings() {
    $('#url_to_block').val(htmlspecialchars_decode(localStorage.url_to_block, 'ENT_QUOTES'));
}

function SaveSettings() {
    var url_to_block = $('#url_to_block').val();

    url_to_block = htmlspecialchars(url_to_block, 'ENT_QUOTES');

    localStorage.clear();
    localStorage.url_to_block = url_to_block;

    $(".notice").html('Settings saved.');
    $(".notice").center(true).css({
        top: '30px'
    });
    $(".notice").fadeIn('slow').delay(1000).fadeOut('slow');
}

function is_int(mixed_var) {
    return mixed_var === ~~mixed_var;
}

document.addEventListener('DOMContentLoaded', function() {
    RestoreSettings();
    document.getElementById('btnSaveSettings').addEventListener('click', SaveSettings);
});
