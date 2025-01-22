/************************************************
 Browser extension code by Bertrand Gondouin (c) 2024
 See LICENSE & LICENSE-typescript
 ************************************************/
import { SEAL, mediaAsset } from './seal'
import { detectMimeType } from "./mimetypes"


/**
 * Listener for runtime messages.
 * 
 * @param {object} message - The message received from the sender.
 */
chrome.runtime.onMessage.addListener(async (message) => {

    if (message.action === "viewMediaSignature") {
        // Convert image source URL to a File object
        let file = await imageSrcToFile(message.url, message.url)
        let seal_file: any = {};
        if (file) {
            // Use FileReader to read the file as an ArrayBuffer
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                // Populate seal_file with the file's data
                seal_file.array_buffer = reader.result
                seal_file.format = file?.type;
                seal_file.name = file?.name;
                fileRead(seal_file);
            }
        }
    }
})

/**
 * Converts an image source URL to a File object.
 * 
 * @param {string} imageSrc - The URL of the image to convert.
 * @param {string} fileName - The desired name for the created File.
 * @returns {Promise<File | void>} - A promise that resolves to the created File or void if an error occurs.
 * @throws {Error} - If the fetch operation fails or the image cannot be converted to a Blob.
 */
async function imageSrcToFile(imageSrc: string, fileName: string): Promise<File | void> {

    try {
        // Fetch the image
        const response = await fetch(imageSrc);
        // Ensure the fetch was successful
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        // Get the image as a Blob
        const blob = await response.blob();

        // Create a File from the Blob
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    } catch (error: any) {
        addModalOverlay(error.message, imageSrc)
        console.error('Error converting image src to File:', error.message);
    }
}

/**
 * Reads a file and processes its SEAL metadata if present.
 * 
 * @param {any} file - The file to be read and processed.
 * @returns {Promise<void>} - A promise that resolves when the file has been processed.
 */
async function fileRead(file: any): Promise<void> {

    // If the file format is not specified, detect the MIME type from the array buffer.
    if (file.format.length === 0) {
        file.format = detectMimeType(file.array_buffer)
    }

    // Create a new media asset from the file's array buffer and name.
    let asset = new mediaAsset(file.array_buffer, file.name);

    // Check if the asset contains SEAL segments.
    if (asset.seal_segments.length > 0) {
        try {
            // Parse the SEAL segments.
            SEAL.parse(asset);

            // Validate the SEAL signature and get the summary.
            let result = await SEAL.validateSig(asset, true);

            // Add a modal overlay with the validation summary.
            addModalOverlay(result.summary, file.name);

        } catch (error) {
            // Log any errors that occur during parsing or validation.
            console.error(error);
        }
    } else {
        // If no SEAL signatures are found, add a modal overlay with an appropriate message.
        addModalOverlay("😢 No SEAL signatures found.", file.name);
    }
}

/**
 * Adds a modal overlay to the current web page, displaying the provided summary and media preview.
 * 
 * @param {string} summary - The summary text to display in the modal.
 * @param {string} srcUrl - The URL of the image to display in the media preview.
 */
function addModalOverlay(summary: string, srcUrl: string) {

    // Create the modal container element.
    const modal = document.createElement('div');
    modal.id = 'seal-modal';

    // Create the content of the modal, including styles.
    const content = document.createElement('div');
    content.innerHTML = `
<style>
        #seal-modal {
            position: fixed;
            background-color:rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        #seal-modal div {
            max-width: 90%;
            background-color: white;
            box-shadow: 0px 0px 24px 0px rgba(66, 68, 90, 1);
            padding: 10px;
            border-radius: 10px;
            display: flex
        }

        #seal-modal button {
            height: 25%;
            background-color: transparent;
            border-radius: 16px;
            border: 2px solid #566963;
            display: inline-block;
            cursor: pointer;
            color: #303a37;
            font-family: Arial;
            font-size: 16px;
            padding: 8px 16px;
            text-decoration: none;
            margin-top: 16px;
        }

        #seal-modal .media-preview {
            background-image: repeating-linear-gradient(45deg, #8e8f98 25%, transparent 25%, transparent 75%, #8e8f98 75%, #8e8f98), repeating-linear-gradient(45deg, #8e8f98 25%, #e5e5f7 25%, #e5e5f7 75%, #8e8f98 75%, #8e8f98);
            background-position: 0 0, 8px 8px;
            background-size: 16px 16px;
            outline-offset: -12px;
            box-shadow:unset;
            margin:10px
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

        #seal-modal pre {
            width: 70%;
            color: #303a37;
            text-wrap: auto;
            overflow: auto;
            line-height: unset;
        }
    </style>
<div class="media-preview"><img src="${srcUrl}"></div>
<pre>${summary}</pre>
<button id="close-modal">Close</button>
    `;
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add an event listener to the close button to remove the modal from the document.
    let closeModalEl = document.getElementById('close-modal');
    if (closeModalEl) {
        closeModalEl.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}