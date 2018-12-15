self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

onmessage = function (event) {
    if (event.data.encrypt) {
        encryptContent(event.data.content, event.data.publicKeys).then(data => {
            postMessage({encryptedContent: data, encrypted: true, callerId: event.data.callerId});
        })
    }
    else if (event.data.encryptSecureMessageReply) {
	    encryptContent(event.data.content, event.data.publicKeys).then(data => {
		    postMessage({encryptedContent: data, encryptSecureMessageReply: true});
	    })
    }
};

async function encryptContent(data, publicKeys) {
    if (!data) {
        return null;
    }
    const options = {
        data: data,
        publicKeys: publicKeys.map(item => openpgp.key.readArmored(item).keys[0])
    };
    return openpgp.encrypt(options).then(ciphertext => {
        return ciphertext.data.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2");
    })
}
