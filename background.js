chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    // showAction
    if (1 == request.showAction) {
        chrome.pageAction.show(sender.tab.id);
        SetPageActionInfo(sender.tab.id, request.biubiuOn);
        chrome.pageAction.onClicked.removeListener(OnPageActionClickedCB);
        chrome.pageAction.onClicked.addListener(OnPageActionClickedCB);
        // Initiate default settings if this is the first time the plugin is activated
        if ('undefined' == typeof(localStorage.url_to_block)) {
            localStorage.url_to_block = "";
        }
        sendResponse({});
        return;
    }
    // getSettings
    if (1 == request.getSettings) {
        sendResponse({
            settings: localStorage
        });
        return;
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.pageAction.getTitle({
        tabId: activeInfo.tabId
    }, function(title) {
        if (title.indexOf('is on.') > 0) {
            chrome.tabs.query({
                currentWindow: true,
                active: true
            }, function(tabs) {
                if (tabs.length == 1) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        updateCookies: 1,
                        settings: localStorage
                    }, function(response) {
                        console.log(response.msg);
                    });
                } else {
                    console.error('Cannot get the current tab.');
                }
            });
        }
    });
});

function OnPageActionClickedCB(tab) {
    // Toggle pageAction icon and title according to whether the biubiu is on
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        if (tabs.length == 1) {
            chrome.tabs.sendMessage(tabs[0].id, {
                toggleBiuBiu: 1
            }, function(response) {
                SetPageActionInfo(tabs[0].id, response.biubiuOn);
                console.log(response.msg);
            });
        } else {
            console.error('Cannot get the current tab.');
        }
    });
};

function SetPageActionInfo(tabId, biubiuOn) {
    // Toggle icons
    var icons = ["img/bug_off_24px.png", "img/bug_on_24px.png"];
    chrome.pageAction.setIcon({
        path: icons[biubiuOn],
        tabId: tabId
    });
    // Toggle title
    var titles = ["BiuBiu is off.", "BiuBiu is on."];
    chrome.pageAction.setTitle({
        title: titles[biubiuOn],
        tabId: tabId
    });
}
