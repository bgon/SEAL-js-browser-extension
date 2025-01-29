(()=>{"use strict";var e={447:function(e,n,i){var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,s){function d(e){try{o(t.next(e))}catch(e){s(e)}}function r(e){try{o(t.throw(e))}catch(e){s(e)}}function o(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(d,r)}o((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.Crypto=void 0;const a=i(185);class s{static getAlgorithmParameters(e,n,i){let t,a=n;if("rsa"==i)t={name:"RSASSA-PKCS1-v1_5",hash:{name:a}};else if("ec"==i){let n;switch(e.length){case 91:default:n="P-256";break;case 120:n="P-384";break;case 156:n="P-521"}t={name:"ECDSA",hash:a,namedCurve:n}}else t={name:"RSASSA-PKCS1-v1_5",hash:{name:a}};return t}static getCryptoKeyLength(e){let n;return"ECDSA"===e.algorithm.name&&(n=parseInt(e.algorithm.namedCurve.replace("P-",""))),"RSASSA-PKCS1-v1_5"===e.algorithm.name&&(n=e.algorithm.modulusLength),n}static importCryptoKey(e,n){return t(this,void 0,void 0,(function*(){return new Promise(((i,s)=>t(this,void 0,void 0,(function*(){const t=yield crypto.subtle.importKey("spki",(0,a.base64ToUint8Array)(e),n,!0,["verify"]).catch((e=>{s({message:e})}));i(t)}))))}))}static verifySignature(e,n,i,a){return t(this,void 0,void 0,(function*(){return"ECDSA"===i.algorithm.name&&(n=s.convertEcdsaAsn1Signature(n)),crypto.subtle.verify(a,i,n,e)}))}static convertEcdsaAsn1Signature(e){const n=s.readAsn1IntegerSequence(e);if(2!==n.length)throw new Error("Expected 2 ASN.1 sequence elements");let[i,t]=n;if(0===i[0]&&i.byteLength%16==1&&(i=i.slice(1)),0===t[0]&&t.byteLength%16==1&&(t=t.slice(1)),i.byteLength%16==15&&(i=new Uint8Array((0,a.mergeBuffer)(new Uint8Array([0]),i))),t.byteLength%16==15&&(t=new Uint8Array((0,a.mergeBuffer)(new Uint8Array([0]),t))),i.byteLength%16!=0)throw new Error("unknown ECDSA sig r length error");if(t.byteLength%16!=0)throw new Error("unknown ECDSA sig s length error");return(0,a.mergeBuffer)(i,t)}static readAsn1IntegerSequence(e){if(48!==e[0])throw new Error("Input is not an ASN.1 sequence");const n=e[1],i=[];let t=e.slice(2,2+n);for(;t.length>0;){if(2!==t[0])throw new Error("Expected ASN.1 sequence element to be an INTEGER");const e=t[1];i.push(t.slice(2,2+e)),t=t.slice(2+e)}return i}}n.Crypto=s},511:function(e,n){var i=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,s){function d(e){try{o(t.next(e))}catch(e){s(e)}}function r(e){try{o(t.throw(e))}catch(e){s(e)}}function o(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(d,r)}o((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.DoH=void 0,n.DoH=class{static getDNSTXTRecords(e,n="https://mozilla.cloudflare-dns.com/dns-query"){return i(this,void 0,void 0,(function*(){return console.time("getDNS_"+n),new Promise(((t,a)=>i(this,void 0,void 0,(function*(){let i;i=`${n}?name=${e}&type=TXT`,yield fetch(i,{method:"GET",headers:{accept:"application/dns-json"}}).then((e=>{if(e.ok)return e.json();throw new Error("Unexpected server response, code: "+e.status)})).then((e=>{if(!e.Answer)throw new Error("No Answer field from DoH");{let n=[];e.Answer.forEach((e=>{let i={};e.data.replace(/".{0,1}"/g,"").replace(/"/g,"").split(" ").forEach((e=>{const n=e.split("=");i[n[0]]=n[1]})),n.push(i)})),t(n)}})).catch((e=>{a(e)})),console.timeEnd("getDNS_"+n)}))))}))}}},927:function(e,n,i){var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,s){function d(e){try{o(t.next(e))}catch(e){s(e)}}function r(e){try{o(t.throw(e))}catch(e){s(e)}}function o(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(d,r)}o((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0});const a=i(871),s=i(582);function d(e,n){n?e={reason:e}:(!0===e.valid?(e.valid="valid",e.valid_css="valid",e.reason="The content of this media has not been altered after it was digitally signed."):!1===e.valid?(e.valid="NOT valid",e.valid_css="not_valid",e.reason="The content of this media has  been altered after it was digitally signed."):n=e.message,e.signed_on||(e.signed_on=""),e.copyright||(e.copyright=""),e.comment||(e.comment=""));const i=document.createElement("div");i.id="seal-modal";const t=document.createElement("div");let a='\n    #seal-modal {\n        color-scheme: light dark;\n        font-family: sans-serif;\n        position: fixed;\n        background: light-dark(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));\n        top: 0;\n        left: 0;\n        height: 100%;\n        width: 100%;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        z-index: 1000;\n    }\n    \n    #seal-modal #panel {\n        background: light-dark(white, #1b1b1b);\n        box-shadow: 0px 0px 24px 0px rgba(66, 68, 90, 1);\n        padding: 10px;\n        border-radius: 10px;\n        display: flex;\n        overflow:auto;\n    }\n    \n    #seal-modal button {\n        height: 20px;\n        background: transparent;\n        border: unset;\n        cursor: pointer;\n        font-size: 16px;\n        filter: invert(1) grayscale(100%) brightness(200%);\n    }\n    \n    #seal-modal .media-preview {\n        background-image: repeating-linear-gradient(45deg, #8e8f98 25%, transparent 25%, transparent 75%, #8e8f98 75%, #8e8f98), repeating-linear-gradient(45deg, #8e8f98 25%, #e5e5f7 25%, #e5e5f7 75%, #8e8f98 75%, #8e8f98);\n        background-position: 0 0, 8px 8px;\n        background-size: 16px 16px;\n        display: flex;\n        justify-content: center;\n    }\n    \n    #seal-modal .media-preview img {\n        max-width: 100%;\n        max-height: 180px;\n        object-fit: cover;\n        overflow: hidden;\n        cursor: pointer;\n    }\n    \n    #seal-modal button:hover {\n        background: transparent;\n    }\n    \n    #seal-modal button:active {\n        position: relative;\n        top: 1px;\n    }\n    \n    #seal-modal .fw-bold {\n        font-weight: 700 !important;\n    }\n    \n    #seal-modal .header {\n        background: light-dark(white, #1b1b1b);\n        display: flex;\n        justify-content: space-between;\n        justify-items: center;\n        align-items: center;\n    }\n    \n    #seal-modal .groups {\n        padding: .5rem 1rem;\n    }\n    \n    #seal-modal .groups>div>div {\n        color: light-dark(#1b1b1b, white);\n        line-height: 18px;\n        padding-inline-start: 20px;\n    \n    }\n    \n    #seal-modal .groups>* {\n        display: table-row;\n    \n    }\n    \n    #seal-modal h2 {\n    font-family: sans-serif;\n        user-select: none;\n        color: light-dark(#1b1b1b, white);\n    }\n\n    #seal-modal p {\n        font-family: sans-serif;\n        color: light-dark(#1b1b1b, white);\n    }\n    \n    #seal-modal h3 {\n    font-family: sans-serif;\n        color: light-dark(#1b1b1b, white);\n        font-size: 18px;\n        margin-bottom: 0.8em;\n        margin-bottom: 8px;\n        margin-top: 16px;\n    }\n    \n    #seal-modal a {\n        color: revert;\n    }\n    \n    #seal-modal .attribute {\n        display: table-cell;\n        white-space: nowrap;\n    }\n    \n    #seal-modal .hashvalue {\n        display: table-cell;\n        overflow-wrap: anywhere;\n    }\n    \n    #seal-modal .value {\n        display: table-cell;\n        white-space: nowrap;\n    }\n    \n    #seal-modal .badge {\n        display: inline-block;\n        padding: .35em .65em;\n        font-size: .75em;\n        font-weight: 700;\n        line-height: 1;\n        color: #fff;\n        text-align: center;\n        white-space: nowrap;\n        vertical-align: baseline;\n        border-radius: .25rem;\n    }\n    \n    \n    #seal-modal .tabs {\n        width: 512px;\n        height: 512px;\n        display: block;\n        margin: 0px auto;\n        position: relative;\n    }\n    \n    #seal-modal .tabs .tab {\n        float: left;\n        display: block;\n    }\n    \n    #seal-modal .tabs .tab>input[type="radio"] {\n        position: absolute;\n        top: -9999px;\n        left: -9999px;\n    }\n    \n    #seal-modal .tabs .tab>label {\n        display: block;\n        padding: 6px 21px;\n        font-size: 12px;\n        text-transform: uppercase;\n        cursor: pointer;\n        position: relative;\n        color: #FFF;\n        background: #4A83FD;\n    }\n    \n    #seal-modal .tabs .content {\n        background: light-dark(white, #1b1b1b);\n        z-index: 0;\n        /* or display: none; */\n        overflow: hidden;\n        padding: 5px;\n        position: absolute;\n        left: 0;\n        opacity: 0;\n        transition: opacity 400ms ease-out;\n        width: 512px;\n    }\n    \n    \n    \n    #seal-modal .tabs>.tab>[id^="tab"]:checked+label {\n        top: 0;\n        background: #303030;\n        color: #F5F5F5;\n    }\n    \n    #seal-modal .tabs>.tab>[id^="tab"]:checked~[id^="tab-content"] {\n        z-index: 1;\n        /* or display: block; */\n    \n        opacity: 1;\n        transition: opacity 400ms ease-out;\n    }\n    #seal-modal .footer {\n        background: light-dark(white, #1b1b1b);\n        font-size: 16px;\n    }\n    #seal-modal .valid { border:1px solid white}\n    #seal-modal .not_valid {border:1px solid red}';t.innerHTML=n?`<style>${a}</style>\n    <div id="seal-modal">\n        <div id="panel">\n            <ul class="tabs">\n                <li class="tab">\n                    <input type="radio" name="tabs" checked="checked" id="tab1" />\n                    <div id="tab-content1" class="content">\n                        \n                        <div class="header">\n                            <div> </div>\n                            <h2> Signature information</h2>\n                            <div><button id="close-modal" type="button" class="btn-close" aria-label="Close">❎</button></div>\n                        </div>\n                         <div class="media-preview">\n                            <img src="${e.url}">\n                        </div>\n\n                         <div class="groups">\n                            <div>\n                                <h3 class="fw-bold">Summary</h3>\n                            </div>\n                            <div>\n    \n                                <div class="attribute">File</div>\n                                <div id="digest" class="value">${e.filename}</div>\n                            </div>\n                            <div>\n    \n                                <div class="attribute">Hostname</div>\n                                <div id="digest" class="value">${e.filedomain}</div>\n                            </div>\n                          </div>  \n                        <div class="footer ${e.valid_css}">\n                            <div class="groups">\n                                <div>\n                                    <h3 class="fw-bold">Signature processing error</h3>\n                                </div>\n                                <p>${n}</p>\n                                <a href="https://github.com/hackerfactor/SEAL/blob/master/README.md"\n                                    title="Secure Evidence Attribution Label (SEAL)">Learn More</a>\n                            </div>\n                        </div>\n                    </div>\n                </li>\n            </ul>\n        </div>\n    </div>`:`<style>${a}\n\n        </style>\n    <div id="seal-modal">\n        <div id="panel">\n    \n            <ul class="tabs">\n    \n                <li class="tab">\n                    <input type="radio" name="tabs" checked="checked" id="tab1" />\n    \n                    <div id="tab-content1" class="content">\n    \n                        <div class="header">\n                            <div> </div>\n                            <h2> Signature information</h2>\n                            <div><button id="close-modal" type="button" class="btn-close" aria-label="Close">❎</button></div>\n                        </div>\n    \n                        <div class="media-preview">\n                            <img src="${e.url}">\n                        </div>\n    \n    \n                        <div class="groups">\n                            <div>\n                                <h3 class="fw-bold">Summary</h3>\n                            </div>\n                            <div>\n    \n                                <div class="attribute">File</div>\n                                <div id="digest" class="value">${e.filename}</div>\n                            </div>\n                            <div>\n    \n                                <div class="attribute">Hostname</div>\n                                <div id="digest" class="value">${e.filedomain}</div>\n                            </div>\n    \n                            <div>\n                                <div class="attribute">Signed By</div>\n                                <div id="digest" class="value"><a href="https://${e.domain}">${e.domain}</a> for user\n                                    ${e.user}</div>\n                            </div>\n                        </div>\n    \n                        <div class="groups">\n    \n                            <div>\n                                <div class="attribute">Signed On</div>\n                                <div id="digest" class="hashvalue">\n                                    ${e.signed_on}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">Copyright</div>\n                                <div id="digest" class="hashvalue">\n                                    ${e.copyright}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">Comment</div>\n                                <div id="digest" class="hashvalue">\n                                    ${e.comment}</div>\n                            </div>\n                        </div>\n    \n    \n    \n                        <div class="footer ${e.valid_css}">\n                            <div class="groups">\n                                <div>\n                                    <h3 class="fw-bold">Signature is ${e.valid}\n                                        <label for="tab2" title="Show validation details"><span>\n                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"\n                                                    fill="currentColor" class="bi bi-box-arrow-up-right"\n                                                    viewBox="0 0 16 16">\n                                                    <path fill-rule="evenodd"\n                                                        d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />\n                                                    <path fill-rule="evenodd"\n                                                        d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />\n                                                </svg></span>\n                                        </label>\n                                    </h3>\n                                </div>\n                                <p>${e.reason}</p>\n                                <a href="https://github.com/hackerfactor/SEAL/blob/master/README.md"\n                                    title="Secure Evidence Attribution Label (SEAL)">Learn More</a>\n    \n    \n    \n    \n                            </div>\n                        </div>\n                    </div>\n    \n    \n                </li>\n                \x3c!-- End Tab 1 --\x3e\n    \n    \n                <li class="tab">\n                    <input type="radio" name="tabs" id="tab2" />\n    \n                    <div id="tab-content2" class="content">\n                        <div class="header">\n                            <div><label for="tab1">⬅️</label></div>\n                            <h2> Details</h2>\n                            <div><button id="close-modal2" type="button" class="btn-close" aria-label="Close">❎</button></div>\n                        </div>\n    \n                        <div class="groups ">\n    \n    \n                            \x3c!-- Signed by --\x3e\n                            <div>\n                                <h3 class="fw-bold">Signed By</h3>\n                            </div>\n                            <div>\n                                <div class="attribute">Domain</div>\n                                <div class="value">${e.domain}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">User</div>\n                                <div class="value">${e.user}</div>\n                            </div>\n    \n                            \x3c!-- Signed On --\x3e\n                            <div>\n                                <h3 class="fw-bold">Signed On</h3>\n                            </div>\n                            <div>\n                                <div class="attribute">Datetime GMT</div>\n                                <div class="value">${e.signed_on}</div>\n                            </div>\n    \n    \n                            \x3c!-- Signature --\x3e\n                            <div>\n                                <h3 class="fw-bold">Signature</h3>\n                            </div>\n                            <div>\n                                <div class="attribute">Signed Bytes</div>\n                                <div class="value">${e.signed_bytes}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">Spans</div>\n                                <div class="value">${e.spans}</div>\n                            </div>\n    \n    \n    \n                            \x3c!-- Fingerprints --\x3e\n                            <div>\n                                <h3 class="fw-bold">${e.digest_algorithm} Fingerprints</h3>\n                            </div>\n                            <div>\n                                <div class="attribute">Digest</div>\n                                <div id="digest" class="hashvalue">\n                                    ${e.digest}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">Double Digest</div>\n                                <div id="double_digest" class="hashvalue">\n                                    ${e.double_digest}</div>\n                            </div>\n    \n                            \x3c!-- Public key --\x3e\n                            <div>\n                                <h3 class="fw-bold">Public Key</h3>\n                            </div>\n                            <div>\n                                <div class="attribute">Algorithm</div>\n                                <div class="value">${e.key_algorithm}</div>\n                            </div>\n                            <div>\n                                <div class="attribute">base64</div>\n                                <div class="hashvalue">\n                                ${e.key_base64}\n                                </div>\n                            </div>\n                        </div>\n    \n                    </div>\n    \n                </li>\n            </ul>\n        </div>\n    </div>`,i.appendChild(t),document.body.appendChild(i);let s=document.getElementById("close-modal");s&&s.addEventListener("click",(()=>{document.body.removeChild(i)}));let d=document.getElementById("close-modal2");d&&d.addEventListener("click",(()=>{document.body.removeChild(i)}))}chrome.runtime.onMessage.addListener((e=>t(void 0,void 0,void 0,(function*(){"viewMediaSignature"===e.action&&s.MediaAsset.UrlToAsset(e.url).then((e=>{!function(e){t(this,void 0,void 0,(function*(){try{d(yield a.SEAL.validateSig(e,!0),"")}catch(e){console.error(e),d("",e)}}))}(e)})).catch((n=>{throw chrome.runtime.sendMessage({action:"openTab",imageSrc:e.url},(e=>{})),new Error("Openning a new tab to fetch the image...")}))}))))},582:function(e,n,i){var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,s){function d(e){try{o(t.next(e))}catch(e){s(e)}}function r(e){try{o(t.throw(e))}catch(e){s(e)}}function o(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(d,r)}o((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.MediaAsset=void 0;const a=i(109);n.MediaAsset=class{static readChunks(e){console.time("readChunks"),e.size=e.data.byteLength,e.data=new Uint8Array(e.data),e.mime||(e.mime=(0,a.detectMimeType)(e.data),console.log(e));let n=!1;e.data.byteLength-65536>65536&&(n=!0);for(let i=0;i<e.data.length;i++)if(i>65536&&!0===n&&(i=e.data.byteLength-65536,n=!1),60==e.data[i]&&115==e.data[i+1]&&101==e.data[i+2]&&97==e.data[i+3]&&108==e.data[i+4]||60==e.data[i]&&63==e.data[i+1]&&115==e.data[i+2]&&101==e.data[i+3]&&97==e.data[i+4]&&108==e.data[i+5]||38==e.data[i]&&108==e.data[i+1]&&116==e.data[i+2]&&59==e.data[i+3]&&115==e.data[i+4]&&101==e.data[i+5]){const n=i;let t=!0;for(;t;)(47==e.data[i]&&62==e.data[i+1]||63==e.data[i]&&62==e.data[i+1]||47==e.data[i]&&38==e.data[i+1]&&103==e.data[i+2]&&116==e.data[i+3])&&(t=!1),i++;const a=(new TextDecoder).decode(e.data.slice(n,i+1)).replace(/\\/gm,"");e.seal_segments||(e.seal_segments=[]),e.seal_segments.push({string:a,signature_end:i-2})}return console.timeEnd("readChunks"),e}static assembleBuffer(e,n){const i=n.reduce(((e,[n,i])=>e+(i-n)),0),t=new Uint8Array(i);let a=0;return n.forEach((([n,i])=>{const s=e.data.slice(n,i);t.set(new Uint8Array(s),a),a+=s.byteLength})),t}static fileToAsset(e){return t(this,void 0,void 0,(function*(){let n={url:"localhost",domain:"localhost",name:e.name};return n.blob=new Blob([e],{type:e.type}),n.data=yield n.blob.arrayBuffer(),n.mime=n.blob.type,0===n.mime.length&&(n.mime=(0,a.detectMimeType)(n.data)),n.size=n.blob.size,(n.mime.includes("image")||n.mime.includes("audio")||n.mime.includes("video"))&&(n.url=URL.createObjectURL(n.blob)),n}))}static UrlToAsset(e){return t(this,void 0,void 0,(function*(){let n={url:e};try{let e=new URL(n.url);n.domain=e.hostname}catch(e){throw new Error("Not an url")}n.name=(n.url.match(/^\w+:(\/+([^\/#?\s]+)){2,}(#|\?|$)/)||[])[2]||"";try{const e=yield fetch(n.url);if(!e.ok)throw new Error("Failed to fetch media");n.blob=yield e.blob(),n.data=yield n.blob.arrayBuffer(),n.mime=n.blob.type,n.size=n.blob.size,0===n.mime.length&&(n.mime=(0,a.detectMimeType)(n.data))}catch(e){throw new Error(e)}return n}))}}},109:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.detectMimeType=void 0;const i=new TextDecoder,t={dcdc:"application/cpl+xml","1f8b08":"application/gzip",25504446:"application/pdf","7b5c72746631":"application/rtf","526172211A0700":"application/vnd.rar","526172211a070100":"application/vnd.rar","425a68":"application/x-bzip2",7573746172003030:"application/x-tar",7573746172202e3:"application/x-tar","504b0304":"application/zip","504b0506":"application/zip","504b0708":"application/zip","2321414d52":"audio/AMR","2e736e64":"audio/basic","646e732e":"audio/basic","4d546864":"audio/midi","667479704d344120":"audio/mp4",fffb:"audio/mp3",fff3:"audio/mp3",fff2:"audio/mp3",ffe3:"audio/mp3",494433:"audio/mp3",fff1:"audio/aac",fff9:"audio/aac",57415645:"audio/wav","464f524d00":"audio/x-aiff","664c6143":"audio/x-flac","424d":"image/bmp","4449434D":"image/dcm",47494638:"image/gif","0000000C6A502020":"image/jp2",ffd8ff:"image/jpeg","89504e470d0a1a0a":"image/png","49492a00":"image/tiff","4d4d002a":"image/tiff","3c737667":"image/svg",38425053:"image/vnd.adobe.photoshop",57454250:"image/webp","010009000003":"image/wmf",d7cdc69a:"image/wmf",5035:"image/x-portable-graymap",5036:"image/x-portable-pixmap","01da01010003":"image/x-rgb","67696d7020786366":"image/x-xcf","0000001466747970336770":"video/3gpp2","0000002066747970336770":"video/3gpp2","6674797069736f6d":"video/mp4","667479704d534e56":"video/mp4","000000186674797033677035":"video/mp4","0000001c667479704d534e56012900464d534e566d703432":"video/mp4",6674797033677035:"video/mp4","00000018667479706d703432":"video/mp4","667479706d703432":"video/mp4",ffd8:"video/mpeg","000001ba":"video/mpeg","4F676753":"video/ogg",1466747970717420:"video/quicktime",6674797071742020:"video/quicktime","6d6f6f76":"video/quicktime","20667479704d3456":"video/x-flv","464c5601":"video/x-flv","1a45dfa3":"video/x-matroska"};n.detectMimeType=function(e){const n=Array.from(e.slice(0,16)).map((e=>e.toString(16).padStart(2,"0"))).join("");for(const[e,i]of Object.entries(t))if(n.includes(e))return i;let a=i.decode(e.slice(1,32));return a.includes("mp4")?"video/mp4":a.includes("heic")?"image/heif":a.includes("jumb")?"application/c2pa":a.includes("DICM")?"image/dcm":/^[\x09\x0A\x0D\x20-\x7E\x80-\xFF]*$/m.test(a)?a.includes("DOCTYPE")&&a.includes("html")?"text/html":a.includes("DOCTYPE")&&a.includes("svg")?"image/svg":"text/plain":"unknown"}},871:function(e,n,i){var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,s){function d(e){try{o(t.next(e))}catch(e){s(e)}}function r(e){try{o(t.throw(e))}catch(e){s(e)}}function o(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(d,r)}o((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.SEAL=n.ValidationError=void 0;const a=i(582),s=i(511),d=i(447),r=i(185);class o extends Error{constructor({name:e,message:n,cause:i}){super(n),this.name=e,this.cause=i}}n.ValidationError=o;class l{static parse(e){console.time("parse"),e.seal_segments[0].string.match(/&quot;/g)&&(e.seal_segments[0].signature_end=e.seal_segments[0].signature_end-5);const n=e.seal_segments[0].string.replace(/<.{0,1}seal /,"").replace(/\?{0,1}\/>/,"").replace(/&quot;/g,'"').replace("<seal:seal>","").replace("/&","").replace("&lt;seal ",""),i={},t=/ ?(.*?)=\"(.*?)\"/gm;let a;for(;null!==(a=t.exec(n));)a.index===t.lastIndex&&t.lastIndex++,i[a[1]]=a[2];switch(i.da||(i.da="sha256"),i.da){case"sha256":default:i.da="SHA-256";break;case"sha384":i.da="SHA-384";break;case"sha512":i.da="SHA-512";break;case"sha1":i.da="SHA-1"}if(!(i.seal&&i.d&&i.ka&&i.s))throw new o({name:"SEAL_RECORD_MISSING_PARAMETERS",message:"The SEAL record is incomplete"});this.record=i,console.timeEnd("parse")}static validateSig(e,n=!1){return t(this,void 0,void 0,(function*(){return new Promise(((i,c)=>t(this,void 0,void 0,(function*(){var t;let u={};if(!(e=a.MediaAsset.readChunks(e)).seal_segments)return u.message="😢 No SEAL signatures found.",u.filename=e.name,u.filemime=e.mime,u.filesize=e.size-1,u.filedomain=e.domain,u.url=e.url,i(u);this.validation={digest_summary:"",signature_bytes:new Uint8Array,signature_encoding:"",verbose:n,doh_api:"https://mozilla.cloudflare-dns.com/dns-query"},l.parse(e);let h=this.record.d;if(!this.public_keys[h]){let e=yield s.DoH.getDNSTXTRecords(h,this.validation.doh_api).catch((e=>c(new o({name:"DNS_LOOKUP",message:"Querying DoH "+this.record.d+" DNS for a TXT record failed",cause:e.message}))));if(!e)return;if(e.forEach((e=>{e.ka&&e.seal&&e.p&&(this.public_keys[h]||(this.public_keys[h]={}),"rsa"===e.ka&&(this.public_keys[h].rsa=e.p),"ec"===e.ka&&(this.public_keys[h].ec=e.p))})),!this.public_keys[h])return c(new o({name:"DNS_LOOKUP",message:"Public key not found or corrupted",cause:JSON.stringify(e)}))}yield l.digest(e).catch((e=>{c(new o({name:"DIGEST_ERROR",message:"Digest can not be processed",cause:e.message}))})),yield l.doubleDigest().catch((e=>{c(new o({name:"DIGEST_ERROR",message:"doubleDigest can not be processed",cause:e.message}))}));let v=d.Crypto.getAlgorithmParameters(this.public_keys[this.record.d][this.record.ka],this.record.da,this.record.ka),g=yield d.Crypto.importCryptoKey(this.public_keys[this.record.d][this.record.ka],v).catch((e=>{c(new o({name:"KEY_IMPORT_ERROR",message:"crypto.subtle.importKey couldn't process the data",cause:e.message}))}));if(this.validation.digest2&&this.validation.signature&&g){console.time("verifySignature");let n=yield d.Crypto.verifySignature(this.validation.digest2,this.validation.signature_bytes,g,v).catch((e=>c(new o({name:"SIGNATURE_VERIFY_ERROR",message:"The signature can not be verified",cause:e.message}))));if(console.timeEnd("verifySignature"),!0===n?(u.message="✅ SEAL record #1 is valid.",u.valid=!0):(u.message="⛔ SEAL record #1 is NOT valid.",u.valid=!1),u.filename=e.name,u.filemime=e.mime,this.validation.verbose){u.filesize=e.size-1,u.filedomain=e.domain,u.url=e.url,u.doh_api=this.validation.doh_api,u.domain=this.record.d,this.validation.signature_date&&(u.signed_on=(0,r.createDate)(this.validation.signature_date).toISOString()),u.digest=Array.from(this.validation.digest1).map((e=>e.toString(16).padStart(2,"0"))).join(""),this.validation.digest2=new Uint8Array(yield crypto.subtle.digest(this.record.da,this.validation.digest2)),u.double_digest=Array.from(this.validation.digest2).map((e=>e.toString(16).padStart(2,"0"))).join(""),u.key_algorithm=`${this.record.ka.toUpperCase()}, ${d.Crypto.getCryptoKeyLength(g)} bits`,u.digest_algorithm=this.record.da,u.key_base64=this.public_keys[this.record.d][this.record.ka];let n=[];null===(t=this.validation.digest_ranges)||void 0===t||t.forEach((e=>{n.push(e[0]+"-"+(e[1]-1))})),u.signed_bytes=n,u.spans=this.validation.digest_summary,u.user=this.record.id,this.record.copyright&&(u.copyright=this.record.copyright),this.record.info&&(u.comment=this.record.info)}i(u)}else c(new o({name:"VALIDATION_MISSING_PARAMETERS",message:"Double Digest or Signature is missing"}))}))))}))}static digest(e){return t(this,void 0,void 0,(function*(){return new Promise(((n,i)=>t(this,void 0,void 0,(function*(){let t,s;console.time("digest"),this.validation.digest_ranges=[],this.record.b&&(this.record.b.split(",").forEach((n=>{var a;let d,r;[d,r]=n.split("~");let o=d.split("-"),l=d.split("+");switch(o[1]?(d=o[0],o=parseInt(o[1])):o=0,l[1]?(d=l[0],l=parseInt(l[1])):l=0,d){case"F":d=0,t||(t="Start of file");break;case"f":d=e.size,t||(t="End of file");break;case"S":d=e.seal_segments[0].signature_end-this.record.s.length,t||(t="Start of signature");break;case"s":d=e.seal_segments[0].signature_end,t||(t="End of signature");break;case"P":case"p":d=0;break;default:return i(new Error("ranges start error"))}switch(d=d+l+o,o=r.split("-"),l=r.split("+"),o[1]?(r=o[0],o=parseInt(o[1])):o=0,l[1]?(r=l[0],l=parseInt(l[1])):l=0,r){case"F":r=0,s="Start of file";break;case"f":r=e.size,s="End of file";break;case"S":r=e.seal_segments[0].signature_end-this.record.s.length,s="start of signature";break;case"s":r=e.seal_segments[0].signature_end,s="end of signature";break;case"P":case"p":r=0;break;default:return i(new Error("ranges stop error"))}r=r+l+o,null===(a=this.validation.digest_ranges)||void 0===a||a.push([d,r]),this.validation.digest_summary=`${t} to ${s}`})),crypto.subtle.digest(this.record.da,a.MediaAsset.assembleBuffer(e,this.validation.digest_ranges)).then((e=>{this.validation.digest1=new Uint8Array(e),console.timeEnd("digest"),n()})).catch((e=>{i(e)})))}))))}))}static doubleDigest(){return new Promise(((e,n)=>t(this,void 0,void 0,(function*(){console.time("doubleDigest");let i=[];if(this.record.sf&&(i=this.record.sf.split(":")),this.record.s){this.validation.signature=this.record.s;try{i.length>0?i.forEach((e=>{if("base64"!=e&&"hex"!=e&&"HEX"!=e&&"bin"!=e||(this.validation.signature_encoding=e,this.validation.signature&&(this.validation.signature=this.validation.signature.replace(e+":",""))),e.includes("date")){let n=parseInt(e.charAt(e.length-1));isNaN(n)?(this.validation.signature=this.record.s.substring(15,this.record.s.length),this.validation.signature_date=this.record.s.substring(0,14)):(this.validation.signature=this.record.s.substring(16+n,this.record.s.length),this.validation.signature_date=this.record.s.substring(0,15+n))}})):this.validation.signature_encoding="base64","hex"!=this.validation.signature_encoding&&"HEX"!=this.validation.signature_encoding||(this.validation.signature_bytes=(0,r.hexToUint8Array)(this.validation.signature)),"base64"==this.validation.signature_encoding&&(this.validation.signature_bytes=(0,r.base64ToUint8Array)(this.validation.signature))}catch(e){return n(e)}}else n(new o({name:"SIGNATURE_MISSING",message:"The signature is missing"}));let t="";this.validation.signature_date&&(t=this.validation.signature_date+":"),this.record.id&&(t=t+this.record.id+":");let a=(new TextEncoder).encode(t);this.validation.digest1?(this.validation.digest2=(0,r.mergeBuffer)(a,this.validation.digest1),console.timeEnd("doubleDigest"),e()):n(new o({name:"DIGEST_MISSING",message:"The digest is missing"}))}))))}}n.SEAL=l,l.public_keys={},l.seals=[]},185:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.createDate=n.mergeBuffer=n.hexToUint8Array=n.base64ToUint8Array=void 0,n.base64ToUint8Array=function(e){const n=atob(e),i=new Uint8Array(n.length);for(let e=0;e<n.length;e++)i[e]=n.charCodeAt(e);return i},n.hexToUint8Array=function(e){if(e.length%2!=0)throw new Error("Hex string must have an even length");const n=new Uint8Array(e.length/2);for(let i=0;i<e.length;i+=2)n[i/2]=parseInt(e.slice(i,i+2),16);return n},n.mergeBuffer=function(e,n){if(!e)return n;if(!n)return e;const i=new Uint8Array(e.byteLength+n.byteLength);return i.set(e,0),i.set(n,e.byteLength),i},n.createDate=function(e){let n,i=e.split(".");i[1]?(e=i[0],n=i[1]):n="000";const t=e.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,"$1-$2-$3T$4:$5:$6."+n+"Z");return new Date(t)}}},n={};!function i(t){var a=n[t];if(void 0!==a)return a.exports;var s=n[t]={exports:{}};return e[t].call(s.exports,s,s.exports,i),s.exports}(927)})();