chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background got a message!")
    sendResponse({})
})

function isFirefox() {
    return navigator.userAgent.includes("Firefox");
}
function isEdge() {
    return navigator.userAgent.includes("Edg");
}
function isChromium()
{ 
    for (var i = 0, u="Chromium", l =u.length; i < navigator.plugins.length; i++)
    {
        if (navigator.plugins[i].name != null && navigator.plugins[i].name.substr(0, l) === u)
            return true;
    }
    return false;
}
function isChrome() {
    return navigator.userAgent.includes("Chrome");
}

function getBrowserString() {
    if (isEdge()) {
        return "Microsoft%20Edge"
    } else if (isChromium()) {
        return "Chromium"
    } else if (isChrome()) {
        return "Chrome"
    }
    return "Unknown"
}

export function getExtensionListString() {
    return "file:///Users/kyu/Library/Application%20Support/" + getBrowserString() + "/Default/Extensions/"
}
function isWindows() {
    return navigator.platform.toLowerCase().startsWith("win");
}
function isMacOS() {
    return navigator.platform.toLowerCase().startsWith("mac");
}