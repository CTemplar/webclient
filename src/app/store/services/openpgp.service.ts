import { Injectable } from '@angular/core';

declare var openpgp;

@Injectable()
export class OpenPgpService {
  options: any;
  encrypted: any;
  private pubkey: any;
  private privkey: any;
  private passphrase: any;
  private privKeyObj: any;
  private fingerprint: string;

  constructor() {

      this.privKeyObj = openpgp.key.readArmored(this.privkey).keys[0];
      // this.decryptPrivateKey();
  }

  generateKey(user) {
    this.passphrase = user.password;
    const options = {
      userIds: [{ name: user.username, email: `${user.username}@ctemplar.com` }],
      numbits: 4096,
      passphrase: this.passphrase
    };
    return openpgp.generateKey(options).then((key) => {
      this.pubkey = key.publicKeyArmored;
      this.privkey = key.privateKeyArmored;
      localStorage.setItem('pubkey', this.pubkey);
      localStorage.setItem('privkey', this.privkey);
      this.privKeyObj = openpgp.key.readArmored(this.privkey).keys[0];
      this.fingerprint = openpgp.key.readArmored(this.pubkey).keys[0].primaryKey.getFingerprint();
      return {
        fingerprint: this.fingerprint,
        privkey: this.privkey,
        pubkey: this.pubkey
      };
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

  async decryptPrivateKey() {
    this.passphrase = 'aaaaaaaaaa';
    await this.privKeyObj.decrypt(this.passphrase);
  }

  async makeEncrypt(obj) {
    this.options = {
      data: obj,
      publicKeys: openpgp.key.readArmored(this.pubkey).keys,
      privateKeys: [this.privKeyObj]
    };
    await openpgp.encrypt(this.options).then((ciphertext) => {
      this.encrypted = ciphertext.data;
      // this.makeDecrypt();
    });
  }

  makeDecrypt(str, pubkey, privkey) {
    console.log(privkey);
    this.options = {
      message: openpgp.message.readArmored(str),
      publicKeys: openpgp.key.readArmored(pubkey).keys,
      privateKeys: [openpgp.key.readArmored(privkey).keys[0]]
    };
    return openpgp.decrypt(this.options).then((plaintext) => {
      console.log(plaintext.data);
      return plaintext.data;
    });

  }
}
