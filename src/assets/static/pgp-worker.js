self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeyObj;

onmessage = function (event) {

    if (!decryptedPrivKeyObj) {
        decryptedPrivKeyObj = openpgp.key.readArmored(event.data.privkey).keys[0];
        decryptedPrivKeyObj.decrypt(event.data.user_key);
        postMessage({key: decryptedPrivKeyObj});
    } else if (event.data.decrypt) {
        decryptContent(event.data.content).then((data) => {
            postMessage({decryptedContent: data, decrypted: true,});
        })
    }
}

function decryptContent(data) {
    if (!data) {
        return null;
    }
    const options = {
        message: openpgp.message.readArmored(data),
        privateKeys: [decryptedPrivKeyObj]
    };

    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data;
    })
}

