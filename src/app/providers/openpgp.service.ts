import { Injectable } from '@angular/core';

declare var openpgp;
@Injectable()
export class OpenPgpService {
  options: any;
  encrypted: any;
  private pubkey: any;
  private privkey: any;
  private passpharse: any;
  private privKeyObj: any;
  private fingerprint: string;

  constructor() {}

  generateKey(user) {
    this.passpharse = user.password;
    const options = {
      userIds: [{name: user.username, email: `${user.username}@ctemplar.com` }],
      numbits: 4096,
      passphrase: this.passpharse
    };
    return openpgp.generateKey(options).then((key) => {
      this.pubkey = key.publicKeyArmored;
      this.privkey = key.privateKeyArmored;
      localStorage.setItem('pubkey', this.pubkey);
      localStorage.setItem('privkey', this.privkey);
      this.privKeyObj = openpgp.key.readArmored(this.privkey).keys[0];
      this.fingerprint = openpgp.key.readArmored(this.pubkey).keys[0].primaryKey.getFingerprint();

      return true;

      // this.privKeyObj.decrypt(this.passpharse).then(() => {
      //   this.makeEncrypt();
      // });
    });
  }

  getFingerprint() {
    return this.fingerprint;
  }

  getPubKey() {
    return this.pubkey;
  }

  getPrivateKey() {
    return this.privkey;
  }

  makeEncrypt() {
    this.options = {
      data: 'hello world',
      publicKeys: openpgp.key.readArmored(this.pubkey).keys,
      privateKeys: [this.privKeyObj]
    };
    openpgp.encrypt(this.options).then((ciphertext) => {
      this.encrypted = ciphertext.data;
      // this.makeDecrypt();
    });
  }

  makeDecrypt() {
    this.options = {
      message: openpgp.message.readArmored(this.encrypted),
      publicKeys: openpgp.key.readArmored(this.pubkey).keys,
      privateKeys: [this.privKeyObj]
    };

    openpgp.decrypt(this.options).then((plaintext) => {
      console.log('plaintext', plaintext.data);
    });

  }
}
