// Show page action
chrome.extension.sendMessage({
    showAction: 1,
    biubiuOn: (1 == $.cookie('cookie_biubiu_on') ? 1:0)
}, function(response) {
    console.log('BiuBiu plugin activated !');
});

function injectScript(source) {
    var elem = document.createElement("script");
    elem.type = "text/javascript";
    elem.innerHTML = source;
    document.documentElement.appendChild(elem);
}

chrome.extension.sendMessage({
    getSettings: 1
}, function(response) {
    var declarations = 'var url_to_block = "' + response.settings.url_to_block + '";';
    injectScript(declarations + "(" + (function() {
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            var biubiuOn = $.cookie('cookie_biubiu_on');
            if (biubiuOn == 1 && options.url == url_to_block) {
                console.log('AJAX request to "' + url_to_block + '" is blocked.');
                jqXHR.abort();
            }
        });
    }).toString() + ")()");
});

// Add listener for page action clicks
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (1 == request.toggleBiuBiu) {
        // Toggle BiuBiu
        console.log('Start to toggle BiuBiu.');
        $.cookie('cookie_biubiu_on', 1 == $.cookie('cookie_biubiu_on') ? 0 : 1);
        // Set settings into cookies
        var biubiuOn = $.cookie('cookie_biubiu_on');
        var msg = '';
        if (1 == biubiuOn) {
            chrome.extension.sendMessage({
                getSettings: 1
            }, function(response) {
                UpdateCookies(response.settings);
            });
            msg = 'BiuBiu is on now.';
        } else {
            msg = 'BiuBiu is off now.';
        }
        console.log(msg);
        sendResponse({
            biubiuOn: biubiuOn,
            msg: msg
        });
    } else if (1 == request.updateCookies) {
        UpdateCookies(request.settings);
        sendResponse({
            msg: 'Cookies updated !'
        });
    }
});

/*
 * Set cookies
 */
function UpdateCookies(settings) {
    for (var key in settings) {
        if (key.indexOf('cookie') === 0) {
            $.cookie(key, settings[key]);
        }
    }
}
