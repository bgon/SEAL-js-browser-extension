/************************************************
 Browser extension code by Bertrand Gondouin (c) 2024
 See LICENSE & LICENSE-typescript
 ************************************************/
import { SEAL } from './seal'
import { MediaAsset } from "./mediaasset"



/**
 * Listener for runtime messages.
 * 
 * @param {object} message - The message received from the sender.
 */
chrome.runtime.onMessage.addListener(async (message) => {

    if (message.action === "viewMediaSignature") {

        // Convert the image URL to a MediaAsset and handle it
        MediaAsset.UrlToAsset(message.url)
            .then(asset => {
                // Validate the asset
                validate(asset);
            }).catch(error => {
                chrome.runtime.sendMessage({ action: 'openTab', imageSrc: message.url }, (response) => {
                });
                showModal({
                    message: 'Opening a new tab to fetch the image...',
                    reason: error
                });
            });
    }
})


/**
 * Reads a file and processes its SEAL metadata if present.
 * 
 * @param {any} asset - The asset to be read and processed.
 * @returns {Promise<void>} - A promise that resolves when the asset has been processed.
 */
async function validate(asset: any): Promise<void> {

    try {
        // Validate the SEAL signature and get the summary.
        let result = await SEAL.validateSig(asset, true);
        showModal(result);

    } catch (error) {
        // Log any errors that occur during parsing or validation.
        console.error(error);
        showModal({
            message: 'Validation Error',
            reason: error
        });
    }
}


const showModal = async (content?: any) => {
    // Modal
    const modal = document.createElement("dialog") as HTMLDialogElement;
    modal.setAttribute("style", `
        position: fixed;
        background: transparent;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        border: 0px;`);

    // iframe
    const iframe = document.createElement("iframe") as HTMLIFrameElement;
    iframe.id = "modal-iframe"
    iframe.setAttribute("style", `
        width:512px;
        height:512px;
        box-shadow: 0px 0px 24px 0px rgba(66, 68, 90, 1);
        border-radius: 20px;
        `
    )
    iframe.src = chrome.runtime.getURL("modal.html");
    iframe.frameBorder = "0";
    iframe.onload = function () {
        iframe.contentWindow?.postMessage(content, '*');
    }

    // button
    const button = document.createElement("button") as HTMLButtonElement;
    button.setAttribute("style", `
        background-color: #fff;
        color: #000;
        padding: 8px 12px;
        font-size: 16px;
        border: none;
        border-radius: 20px;
        position: relative;
        top: -256px;
        left: 528px;
        `
    );
    button.innerHTML = "X"
    button.addEventListener("click", () => {
        modal.close();

    });

    modal.addEventListener("close", (event) => {
        modal.remove();
    });

    modal.appendChild(iframe);
    modal.appendChild(button);
    modal.appendChild(iframe);
    document.body.appendChild(modal);

    modal.showModal();
}
