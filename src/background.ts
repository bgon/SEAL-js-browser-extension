/************************************************
 Browser extension code by Bertrand Gondouin (c) 2024
 See LICENSE & LICENSE-typescript
 ************************************************/

/**
* Event listener for 'onInstalled' event in Chrome Runtime API.
* This function is called when a new extension instance is created or updated.
*/

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    console.debug('This is a first-time install!')
    void chrome.storage.local.set({ autoScan: false })
  } else if (details.reason === 'update') {
    console.debug('The extension has been updated to version:', chrome.runtime.getManifest().version)
  } else if (details.reason === 'chrome_update') {
    console.debug('Chrome has been updated.')
  }
  createContextMenu()
})

/*
// ID to manage the context menu entry
let cmid: string | null = null;

const cm_clickHandler: (clickData: any, tab: chrome.tabs.Tab) => void = function
  (clickData, tab) {
  alert(`Selected ${clickData?.selectionText || ''} in ${tab.url}`);
};

chrome.runtime.onMessage.addListener(async function listener(msg: {
  request: string;
  selection?: string
}, sender: chrome.runtime.MessageSender, sendResponse: (response:
  any) => void): Promise<void> {
  if (msg.request === 'updateContextMenu') {

    chrome.contextMenus.update("viewMediaSignature",{title: msg.selection})
  }
});

*/

/**
 * Creates a context menu item for viewing media signatures.
 */
function createContextMenu(): void {
  chrome.contextMenus.create({
    id: 'viewMediaSignature',
    title: 'View media signature',
    contexts: ['audio', 'image', 'video'],
    documentUrlPatterns: ['<all_urls>']
  })
}

/**
 * Handles the context menu click event.
 * 
 * @param {chrome.contextMenus.OnClickData} info - The information about the item clicked and the context where the click happened.
 * @param {chrome.tabs.Tab} tab - The details of the tab where the click took place.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.srcUrl;

  // If the URL is not present, return early.
  if (url == null) {
    return;
  }

  // Create a message to send to the content script.
  const message = { action: "viewMediaSignature", url: url };

  // If the tab ID is present, send the message to the content script in the tab.
  if (tab?.id != null) {
    void chrome.tabs.sendMessage(tab.id, message);
  }
});


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("message opentab",message)
  if (message.action === 'openTab') {
    console.log('Message received:', message);
    let tab = await chrome.tabs.create({ url: message.imageSrc, active: false });
    let cors_tab_id = tab.id

    console.log("tab", tab)


    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
     
      if (cors_tab_id == tabId && changeInfo.status === 'complete') {

        console.log('Tab loaded:', tab.url);

        message = { action: "viewMediaSignature", url: message.imageSrc };

        void chrome.tabs.sendMessage(cors_tab_id, message);


      }

    });


    sendResponse({ response: 'tab opened' });
  }
});