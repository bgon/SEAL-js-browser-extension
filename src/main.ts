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
                    //console.log('Response from background:', response);
                });
                throw new Error('Openning a new tab to fetch the image...');
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

        // Add a modal overlay with the validation summary.
        addModalOverlay(result, '');

    } catch (error) {
        // Log any errors that occur during parsing or validation.
        console.error(error);
        addModalOverlay('', error as string)
    }
}

/**
 * Adds a modal overlay to the current web page, displaying the provided summary and media preview.
 * 
 * @param {string} summary - The summary text to display in the modal.
 * @param {string} srcUrl - The URL of the image to display in the media preview.
 */
function addModalOverlay(result: any, error: string) {

    if (!error) {

        if (result.valid === true) {
            result.valid = "valid"
            result.valid_css = "valid"
            result.reason = "The content of this media has not been altered after it was digitally signed."
        } else if (result.valid === false) {
            result.valid = "NOT valid"
            result.valid_css = "not_valid"
            result.reason = "The content of this media has  been altered after it was digitally signed."
        } else {
            error = result.message;
        }

        if (!result.signed_on) {
            result.signed_on = '';
        }

        if (!result.copyright) {
            result.copyright = '';
        }

        if (!result.comment) {
            result.comment = '';
        }
    } else {
        result = { reason: result }

    }

    // Create the modal container element.
    const modal = document.createElement('div');
    modal.id = 'seal-modal';

    // Create the content of the modal, including styles.
    const content = document.createElement('div');

    let css = `
    #seal-modal {
        color-scheme: light dark;
        font-family: sans-serif;
        position: fixed;
        background-color: light-dark(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    #seal-modal #panel {
        background-color: light-dark(white, #1b1b1b);
        box-shadow: 0px 0px 24px 0px rgba(66, 68, 90, 1);
        padding: 10px;
        border-radius: 10px;
        display: flex;
        overflow:auto;
    }
    
    #seal-modal button {
        height: 20px;
        background-color: transparent;
        border: unset;
        cursor: pointer;
        font-size: 16px;
        filter: invert(1) grayscale(100%) brightness(200%);
    }
    
    #seal-modal .media-preview {
        background-image: repeating-linear-gradient(45deg, #8e8f98 25%, transparent 25%, transparent 75%, #8e8f98 75%, #8e8f98), repeating-linear-gradient(45deg, #8e8f98 25%, #e5e5f7 25%, #e5e5f7 75%, #8e8f98 75%, #8e8f98);
        background-position: 0 0, 8px 8px;
        background-size: 16px 16px;
        display: flex;
        justify-content: center;
    }
    
    #seal-modal .media-preview img {
        max-width: 100%;
        max-height: 180px;
        object-fit: cover;
        overflow: hidden;
        cursor: pointer;
    }
    
    #seal-modal button:hover {
        background-color: transparent;
    }
    
    #seal-modal button:active {
        position: relative;
        top: 1px;
    }
    
    #seal-modal .fw-bold {
        font-weight: 700 !important;
    }
    
    #seal-modal .header {
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
    }
    
    #seal-modal .groups {
        padding: .5rem 1rem;
    }
    
    #seal-modal .groups>div>div {
        color: light-dark(#1b1b1b, white);
        line-height: 18px;
        padding-inline-start: 20px;
    
    }
    
    #seal-modal .groups>* {
        display: table-row;
    
    }
    
    #seal-modal h2 {
    font-family: sans-serif;
        user-select: none;
        color: light-dark(#1b1b1b, white);
    }

    #seal-modal p {
        font-family: sans-serif;
        color: light-dark(#1b1b1b, white);
    }
    
    #seal-modal h3 {
    font-family: sans-serif;
        color: light-dark(#1b1b1b, white);
        font-size: 18px;
        margin-bottom: 0.8em;
        margin-bottom: 8px;
        margin-top: 16px;
    }
    
    #seal-modal a {
        color: revert;
    }
    
    #seal-modal .attribute {
        display: table-cell;
        white-space: nowrap;
    }
    
    #seal-modal .hashvalue {
        display: table-cell;
        overflow-wrap: anywhere;
    }
    
    #seal-modal .value {
        display: table-cell;
        white-space: nowrap;
    }
    
    #seal-modal .badge {
        display: inline-block;
        padding: .35em .65em;
        font-size: .75em;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25rem;
    }
    
    
    #seal-modal .tabs {
        width: 512px;
        height: 512px;
        display: block;
        margin: 0px auto;
        position: relative;
    }
    
    #seal-modal .tabs .tab {
        float: left;
        display: block;
    }
    
    #seal-modal .tabs .tab>input[type="radio"] {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }
    
    #seal-modal .tabs .tab>label {
        display: block;
        padding: 6px 21px;
        font-size: 12px;
        text-transform: uppercase;
        cursor: pointer;
        position: relative;
        color: #FFF;
        background: #4A83FD;
    }
    
    #seal-modal .tabs .content {
        z-index: 0;
        /* or display: none; */
        overflow: hidden;
        padding: 5px;
        position: absolute;
        left: 0;
        opacity: 0;
        transition: opacity 400ms ease-out;
        width: 512px;
    }
    
    
    
    #seal-modal .tabs>.tab>[id^="tab"]:checked+label {
        top: 0;
        background: #303030;
        color: #F5F5F5;
    }
    
    #seal-modal .tabs>.tab>[id^="tab"]:checked~[id^="tab-content"] {
        z-index: 1;
        /* or display: block; */
    
        opacity: 1;
        transition: opacity 400ms ease-out;
    }

    #seal-modal .valid { border:1px solid white}
    #seal-modal .not_valid {border:1px solid red}`

    if (!error) {
        content.innerHTML = `<style>${css}

        </style>
    <div id="seal-modal">
        <div id="panel">
    
            <ul class="tabs">
    
                <li class="tab">
                    <input type="radio" name="tabs" checked="checked" id="tab1" />
    
                    <div id="tab-content1" class="content">
    
                        <div class="header">
                            <div> </div>
                            <h2> Signature information</h2>
                            <div><button id="close-modal" type="button" class="btn-close" aria-label="Close">❎</button></div>
                        </div>
    
                        <div class="media-preview">
                            <img src="${result.url}">
                        </div>
    
    
                        <div class="groups">
                            <div>
                                <h3 class="fw-bold">Summary</h3>
                            </div>
                            <div>
    
                                <div class="attribute">File</div>
                                <div id="digest" class="value">${result.filename}</div>
                            </div>
                            <div>
    
                                <div class="attribute">Hostname</div>
                                <div id="digest" class="value">${result.filedomain}</div>
                            </div>
    
                            <div>
                                <div class="attribute">Signed By</div>
                                <div id="digest" class="value"><a href="https://${result.domain}">${result.domain}</a> for user
                                    ${result.user}</div>
                            </div>
                        </div>
    
                        <div class="groups">
    
                            <div>
                                <div class="attribute">Signed On</div>
                                <div id="digest" class="hashvalue">
                                    ${result.signed_on}</div>
                            </div>
                            <div>
                                <div class="attribute">Copyright</div>
                                <div id="digest" class="hashvalue">
                                    ${result.copyright}</div>
                            </div>
                            <div>
                                <div class="attribute">Comment</div>
                                <div id="digest" class="hashvalue">
                                    ${result.comment}</div>
                            </div>
                        </div>
    
    
    
                        <div class="footer ${result.valid_css}">
                            <div class="groups">
                                <div>
                                    <h3 class="fw-bold">Signature is ${result.valid}
                                        <label for="tab2" title="Show validation details"><span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-box-arrow-up-right"
                                                    viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd"
                                                        d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                                                    <path fill-rule="evenodd"
                                                        d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                                                </svg></span>
                                        </label>
                                    </h3>
                                </div>
                                <p>${result.reason}</p>
                                <a href="https://github.com/hackerfactor/SEAL/blob/master/README.md"
                                    title="Secure Evidence Attribution Label (SEAL)">Learn More</a>
    
    
    
    
                            </div>
                        </div>
                    </div>
    
    
                </li>
                <!-- End Tab 1 -->
    
    
                <li class="tab">
                    <input type="radio" name="tabs" id="tab2" />
    
                    <div id="tab-content2" class="content">
                        <div class="header">
                            <div><label for="tab1">⬅️</label></div>
                            <h2> Details</h2>
                            <div><button id="close-modal2" type="button" class="btn-close" aria-label="Close">❎</button></div>
                        </div>
    
                        <div class="groups ">
    
    
                            <!-- Signed by -->
                            <div>
                                <h3 class="fw-bold">Signed By</h3>
                            </div>
                            <div>
                                <div class="attribute">Domain</div>
                                <div class="value">${result.domain}</div>
                            </div>
                            <div>
                                <div class="attribute">User</div>
                                <div class="value">${result.user}</div>
                            </div>
    
                            <!-- Signed On -->
                            <div>
                                <h3 class="fw-bold">Signed On</h3>
                            </div>
                            <div>
                                <div class="attribute">Datetime GMT</div>
                                <div class="value">${result.signed_on}</div>
                            </div>
    
    
                            <!-- Signature -->
                            <div>
                                <h3 class="fw-bold">Signature</h3>
                            </div>
                            <div>
                                <div class="attribute">Signed Bytes</div>
                                <div class="value">${result.signed_bytes}</div>
                            </div>
                            <div>
                                <div class="attribute">Spans</div>
                                <div class="value">${result.spans}</div>
                            </div>
    
    
    
                            <!-- Fingerprints -->
                            <div>
                                <h3 class="fw-bold">${result.digest_algorithm} Fingerprints</h3>
                            </div>
                            <div>
                                <div class="attribute">Digest</div>
                                <div id="digest" class="hashvalue">
                                    ${result.digest}</div>
                            </div>
                            <div>
                                <div class="attribute">Double Digest</div>
                                <div id="double_digest" class="hashvalue">
                                    ${result.double_digest}</div>
                            </div>
    
                            <!-- Public key -->
                            <div>
                                <h3 class="fw-bold">Public Key</h3>
                            </div>
                            <div>
                                <div class="attribute">Algorithm</div>
                                <div class="value">${result.key_algorithm}</div>
                            </div>
                            <div>
                                <div class="attribute">base64</div>
                                <div class="hashvalue">
                                ${result.key_base64}
                                </div>
                            </div>
                        </div>
    
                    </div>
    
                </li>
            </ul>
        </div>
    </div>`;
    } else {
        content.innerHTML = `<style>${css}</style>
    <div id="seal-modal">
        <div id="panel">
            <ul class="tabs">
                <li class="tab">
                    <input type="radio" name="tabs" checked="checked" id="tab1" />
                    <div id="tab-content1" class="content">
                        
                        <div class="header">
                            <div> </div>
                            <h2> Signature information</h2>
                            <div><button id="close-modal" type="button" class="btn-close" aria-label="Close">❎</button></div>
                        </div>
                         <div class="media-preview">
                            <img src="${result.url}">
                        </div>

                         <div class="groups">
                            <div>
                                <h3 class="fw-bold">Summary</h3>
                            </div>
                            <div>
    
                                <div class="attribute">File</div>
                                <div id="digest" class="value">${result.filename}</div>
                            </div>
                            <div>
    
                                <div class="attribute">Hostname</div>
                                <div id="digest" class="value">${result.filedomain}</div>
                            </div>
                          </div>  
                        <div class="footer ${result.valid_css}">
                            <div class="groups">
                                <div>
                                    <h3 class="fw-bold">Signature processing error</h3>
                                </div>
                                <p>${error}</p>
                                <a href="https://github.com/hackerfactor/SEAL/blob/master/README.md"
                                    title="Secure Evidence Attribution Label (SEAL)">Learn More</a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>`
    }

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add an event listener to the close button to remove the modal from the document.
    let closeModalEl = document.getElementById('close-modal');
    if (closeModalEl) {
        closeModalEl.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    let closeModalEl2 = document.getElementById('close-modal2');
    if (closeModalEl2) {
        closeModalEl2.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}