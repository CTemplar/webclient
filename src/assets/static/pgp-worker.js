self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeyObj;

onmessage = function (event) {
    if (event.data.clear) {
        decryptedPrivKeyObj = null;
    } else if (!decryptedPrivKeyObj) {
        decryptedPrivKeyObj = openpgp.key.readArmored(event.data.privkey).keys[0];
        decryptedPrivKeyObj.decrypt(event.data.user_key);
        postMessage({key: decryptedPrivKeyObj});
    } else if (event.data.decrypt) {
        if (!event.data.content) {
            postMessage({decryptedContent: event.data.content, decrypted: true, callerId: event.data.callerId});
        } else {
            decryptContent(event.data.content).then((data) => {
                postMessage({decryptedContent: data, decrypted: true, callerId: event.data.callerId});
            })
        }
    }
}

function decryptContent(data) {
    const options = {
        message: openpgp.message.readArmored(data),
        privateKeys: [decryptedPrivKeyObj]
    };

    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data;
    })
}

