self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeys = {};
var decryptedSecureMsgPrivKeyObj;

onmessage = function (event) {
    if (event.data.clear) {
        decryptedPrivKeys = {};
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
    else if (event.data.decryptPrivateKeys) {
    	if (event.data.privkeys) {
    		event.data.privkeys.forEach(key => {
    			if (!decryptedPrivKeys[key.mailboxId]) {
				    decryptedPrivKeys[key.mailboxId] = openpgp.key.readArmored(key.privkey).keys[0];
				    decryptedPrivKeys[key.mailboxId].decrypt(event.data.user_key);
			    }
		    });
	    }
      postMessage({keys: decryptedPrivKeys, decryptPrivateKeys: true});
    }
    else if (event.data.decrypt) {
        if (!event.data.content || !event.data.mailboxId) {
            postMessage({decryptedContent: event.data.content, decrypted: true, callerId: event.data.callerId});
        } else {
            decryptContent(event.data.content, decryptedPrivKeys[event.data.mailboxId]).then((data) => {
                postMessage({decryptedContent: data, decrypted: true, callerId: event.data.callerId});
            })
        }
    }
    else if (event.data.changePassphrase) {
        changePassphrase(event.data.passphrase).then((data) => {
            postMessage(data);
        });
    }
    else if (event.data.revertPassphrase) {
        changePassphrase(event.data.passphrase).then((data) => {
        });
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
            public_key: key.publicKeyArmored.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2"),
            private_key: key.privateKeyArmored.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2"),
            fingerprint: openpgp.key.readArmored(key.publicKeyArmored).keys[0].primaryKey.getFingerprint()
        };
    });
}


async function changePassphrase(passphrase) {
    var privkeys = [];
    for (var key in decryptedPrivKeys) {
        if (decryptedPrivKeys.hasOwnProperty(key)) {
            await decryptedPrivKeys[key].encrypt(passphrase);
            privkeys.push({
                mailbox_id: key,
                private_key: decryptedPrivKeys[key].armor().replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2"),
            });
            decryptedPrivKeys[key].decrypt(passphrase);
        }
    }
    return {privkeys, changePassphrase: true};
}