self.window = {}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

onmessage = function (event) {
    console.log('trying to decrypt key in web worker');
    var decryptedPrivKeyObj = openpgp.key.readArmored(event.data.privkey).keys[0];
    decryptedPrivKeyObj.decrypt(event.data.user_key);
    postMessage({key: decryptedPrivKeyObj});
    console.log("key decrypted successfully.");
}