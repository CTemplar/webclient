self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeyObj;

onmessage = function (event) {

    if (!decryptedPrivKeyObj) {
        decryptedPrivKeyObj = openpgp.key.readArmored(event.data.privkey).keys[0];
        decryptedPrivKeyObj.decrypt(event.data.user_key);
        postMessage({key: decryptedPrivKeyObj});
    } else if (event.data.encrypt) {
        encryptContent(event.data.content, event.data.publicKeys).then(ciphertext => {
            postMessage({encryptedContent: ciphertext.data});
        })
    } else if (event.data.decrypt) {
        decryptContent(event.data.content).then((plaintext) => {
            postMessage({decryptedContent: plaintext.data});
        })
    }
}

async function encryptContent(data, publicKeys) {
    const options = {
        data: data,
        publicKeys: openpgp.key.readArmored(publicKeys).keys
    };
    if (decryptedPrivKeyObj) {
        options.privateKeys = [decryptedPrivKeyObj];
    }
    return openpgp.encrypt(options);
}

function decryptContent(data) {
    const options = {
        message: openpgp.message.readArmored(data),
        privateKeys: [decryptedPrivKeyObj]
    };
    return openpgp.decrypt(options);
}

