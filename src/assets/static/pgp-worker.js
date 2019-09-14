self.window = {crypto: self.crypto}; // to make UMD bundles work

importScripts('/openpgp.min.js');
var openpgp = window.openpgp;

var decryptedPrivKeys = {};
var decryptedSecureMsgPrivKeyObj;

onmessage = async function (event) {
    if (event.data.clear) {
        decryptedPrivKeys = {};
    } else if (event.data.encrypt) {
        encryptContent(event.data.mailData.content, event.data.publicKeys).then(content => {
            encryptContent(event.data.mailData.subject, event.data.publicKeys).then(subject => {
                postMessage({encryptedContent: {content, subject}, encrypted: true, callerId: event.data.callerId});
            });
        })
    } else if (event.data.encryptAttachment) {
        encryptBinaryContent(event.data.fileData, event.data.publicKeys).then(content => {
            postMessage({encryptedContent: content, encryptedAttachment: true, attachment: event.data.attachment});
        })
    } else if (event.data.encryptSecureMessageReply) {
        encryptContent(event.data.content, event.data.publicKeys).then(data => {
            postMessage({encryptedContent: data, encryptSecureMessageReply: true});
        })
    } else if (event.data.generateKeys) {
        generateKeys(event.data.options).then((data) => {
            postMessage({
                generateKeys: true,
                keys: data,
                callerId: event.data.callerId,
                forEmail: !!event.data.forEmail
            });
        })
    } else if (event.data.decryptSecureMessageKey) {
        decryptedSecureMsgPrivKeyObj = (await openpgp.key.readArmored(event.data.privKey)).keys[0];
        decryptedSecureMsgPrivKeyObj.decrypt(event.data.password)
            .then(res => {
                postMessage({decryptSecureMessageKey: true, decryptedKey: decryptedSecureMsgPrivKeyObj});
            })
            .catch(error => {
                postMessage({decryptSecureMessageKey: true, error: error.message});
            });
    } else if (event.data.decryptSecureMessageContent) {
        if (!event.data.mailData) {
            postMessage({decryptedContent: '', decryptSecureMessageContent: true});
        } else {
            decryptContent(event.data.mailData.content, decryptedSecureMsgPrivKeyObj).then((content) => {
                decryptContent(event.data.mailData.subject, decryptedSecureMsgPrivKeyObj).then((subject) => {
                    postMessage({mailData: {content, subject}, decryptSecureMessageContent: true});
                })
            })
        }
    } else if (event.data.decryptPrivateKeys) {
        if (event.data.privkeys) {
            event.data.privkeys.forEach(async key => {
                if (!decryptedPrivKeys[key.mailboxId]) {
                    decryptedPrivKeys[key.mailboxId] = (await openpgp.key.readArmored(key.privkey)).keys[0];
                    decryptedPrivKeys[key.mailboxId].decrypt(event.data.user_key);
                }
            });
        }
        postMessage({keys: decryptedPrivKeys, decryptPrivateKeys: true});
    } else if (event.data.decrypt) {
        if (!event.data.mailboxId) {
            postMessage({decryptedContent: {}, decrypted: true, callerId: event.data.callerId});
        } else {
            decryptContent(event.data.mailData.content, decryptedPrivKeys[event.data.mailboxId]).then((content) => {
                decryptContent(event.data.mailData.subject, decryptedPrivKeys[event.data.mailboxId]).then((subject) => {
                    decryptContent(event.data.mailData.incomingHeaders, decryptedPrivKeys[event.data.mailboxId]).then((incomingHeaders) => {
                        postMessage({
                            decryptedContent: {incomingHeaders, content, subject},
                            decrypted: true,
                            callerId: event.data.callerId,
                            isDecryptingAllSubjects: event.data.isDecryptingAllSubjects
                        });
                    });
                });

            });
        }
    } else if (event.data.changePassphrase) {
        if (event.data.deleteData) {
            generateNewKeys(event.data.mailboxes, event.data.passphrase, event.data.username).then((data) => {
                postMessage(data);
            });
        } else {
            changePassphrase(event.data.passphrase).then((data) => {
                postMessage(data);
            });
        }
    } else if (event.data.revertPassphrase) {
        changePassphrase(event.data.passphrase).then((data) => {
        });
    } else if (event.data.encryptJson) {
        encryptContent(event.data.content, event.data.publicKeys).then(content => {
            postMessage({...event.data, encryptedContent: content});

        })
    } else if (event.data.decryptJson) {
        if (event.data.isContactsArray) {
            const promises = [];
            for (let i = 0; i < event.data.contacts.length; i++) {
                promises.push(decryptContent(event.data.contacts[i].encrypted_data, decryptedPrivKeys[event.data.mailboxId]));
            }
            Promise.all(promises).then(data => {
                for (let i = 0; i < event.data.contacts.length; i++) {
                    event.data.contacts[i] = {
                        ...event.data.contacts[i], ...JSON.parse(data[i]),
                        encrypted_data: null,
                        is_encrypted: false
                    };
                }
                postMessage({...event.data});
            });
        } else if (event.data.isContact) {
            decryptContent(event.data.content, decryptedPrivKeys[event.data.mailboxId]).then((content) => {
                postMessage({...event.data, content});
            })
        }
    }
}

async function decryptContent(data, privKeyObj) {
    if (!data) {
        return Promise.resolve(data);
    }
    try {
        const options = {
            message: await openpgp.message.readArmored(data),
            privateKeys: [privKeyObj]
        };

        return openpgp.decrypt(options).then(plaintext => {
            return plaintext.data;
        })
    } catch (e) {
        console.error(e);
        return Promise.resolve(data);
    }
}

function generateKeys(options) {
    return openpgp.generateKey(options).then(async key => {
        return {
            public_key: key.publicKeyArmored.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2"),
            private_key: key.privateKeyArmored.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2"),
            fingerprint: (await openpgp.key.readArmored(key.publicKeyArmored)).keys[0].primaryKey.getFingerprint()
        };
    });
}


async function generateNewKeys(mailboxes, password, username) {
    const newKeys = [];
    for (let i = 0; i < mailboxes.length; i++) {
        const options = {
            userIds: [{name: username, email: mailboxes[i].email}],
            numBits: 4096,
            passphrase: password
        };
        const keys = await generateKeys(options);
        newKeys.push({...keys, mailbox_id: mailboxes[i].id});
    }
    return {keys: newKeys, changePassphrase: true};
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
    return {keys: privkeys, changePassphrase: true};
}


async function encryptContent(data, publicKeys) {
    if (!data) {
        return Promise.resolve(data);
    }
    const pubkeys = await Promise.all(publicKeys.map(async (key) => {
        return (await openpgp.key.readArmored(key)).keys[0]
    }));
    const options = {
        message: openpgp.message.fromText(data),
        publicKeys: pubkeys
    };
    return openpgp.encrypt(options).then(ciphertext => {
        return ciphertext.data.replace(/(\r\n|\n|\r)((\r\n|\n|\r)\S+(\r\n|\n|\r)-+END PGP)/m, "$2");
    })
}

async function encryptBinaryContent(data, publicKeys) {
    if (!data) {
        return Promise.resolve(data);
    }
    const pubkeys = await Promise.all(publicKeys.map(async (key) => {
        return (await openpgp.key.readArmored(key)).keys[0]
    }));
    const options = {
        message: openpgp.message.fromBinary(data),
        publicKeys: pubkeys,
        armor: false // don't ASCII armor (for Uint8Array output)
    };

    return openpgp.encrypt(options).then(ciphertext => {
        return ciphertext.message.packets.write(); // get raw encrypted packets as Uint8Array
    });
}

async function decryptBinaryContent(data, privKeyObj) {
    if (!data) {
        return Promise.resolve(data);
    }
    try {
        const options = {
            message: await openpgp.message.read(data),
            privateKeys: [privKeyObj],
            format: 'binary' // output as Uint8Array
        };

        return openpgp.decrypt(options).then(plaintext => {
            return plaintext.data; //Uint8Array
        })
    } catch (e) {
        console.error(e);
        return Promise.resolve(data);
    }
}
