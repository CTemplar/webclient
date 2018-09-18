self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeyObj;
var decryptedSecureMsgPrivKeyObj;

onmessage = function (event) {
    if (event.data.clear) {
        decryptedPrivKeyObj = null;
    }
    else if (event.data.generateKeys) {
        generateKeys(event.data.options).then((data) => {
            postMessage({generateKeys: true, keys: data, callerId: event.data.callerId, forEmail: !!event.data.forEmail});
        })
    }
    else if (event.data.decryptSecureMessageKey) {
	    decryptedSecureMsgPrivKeyObj = openpgp.key.readArmored(event.data.privKey).keys[0];
	    decryptedSecureMsgPrivKeyObj.decrypt(event.data.password)
		    .then(res => {
			    postMessage({decryptSecureMessageKey: true, decryptedKey: decryptedSecureMsgPrivKeyObj});
		    })
		    .catch(error => {
			    postMessage({decryptSecureMessageKey: true, error: error.message});
		    });
    }
    else if (event.data.decryptSecureMessageContent) {
	    if (!event.data.content) {
		    postMessage({decryptedContent: event.data.content, decryptSecureMessageContent: true});
	    } else {
		    decryptContent(event.data.content, decryptedSecureMsgPrivKeyObj).then((data) => {
			    postMessage({decryptedContent: data, decryptSecureMessageContent: true});
		    })
	    }
    }
    else if (event.data.decryptPrivateKey) {
        decryptedPrivKeyObj = openpgp.key.readArmored(event.data.privkey).keys[0];
        decryptedPrivKeyObj.decrypt(event.data.user_key);
        postMessage({key: decryptedPrivKeyObj, decryptPrivateKey: true});
    }
    else if (event.data.decrypt) {
        if (!event.data.content) {
            postMessage({decryptedContent: event.data.content, decrypted: true, callerId: event.data.callerId});
        } else {
            decryptContent(event.data.content, decryptedPrivKeyObj).then((data) => {
                postMessage({decryptedContent: data, decrypted: true, callerId: event.data.callerId});
            })
        }
    }
}

function decryptContent(data, privKeyObj) {
    const options = {
        message: openpgp.message.readArmored(data),
        privateKeys: [privKeyObj]
    };

    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data;
    })
}

function generateKeys(options) {
    return openpgp.generateKey(options).then(key => {
        return {
            public_key: key.publicKeyArmored,
            private_key: key.privateKeyArmored,
            fingerprint: openpgp.key.readArmored(key.publicKeyArmored).keys[0].primaryKey.getFingerprint()
        };
    });
}

