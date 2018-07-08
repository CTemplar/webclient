import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, MailBoxesState } from '../datatypes';

declare var openpgp;
openpgp.initWorker({ path: 'openpgp.worker.min.js' });

@Injectable()
export class OpenPgpService {
  options: any;
  encrypted: any;
  private pubkey: any;
  private privkey: any;
  private decryptedPrivKeyObj: any;
  private passphrase: any;
  private fingerprint: string;

  constructor(private store: Store<AppState>) {

    this.store.select(state => state.mailboxes)
      .subscribe((response: MailBoxesState) => {
        // TODO: replace mailboxes[0] with the mailbox selected by user
        if (response.mailboxes[0]) {
          this.pubkey = response.mailboxes[0].public_key;
          this.privkey = response.mailboxes[0].private_key;
        }
        this.decryptPrivateKey();
      });

    this.store.select(state => state.user)
      .subscribe((user) => {
        if (user.mailboxes[0]) {
          this.passphrase = user.mailboxes[0].passphrase;
        }
        this.decryptPrivateKey();
      });
  }

  decryptPrivateKey() {
    if (this.privkey && this.passphrase && !this.decryptedPrivKeyObj) {
      this.decryptedPrivKeyObj = openpgp.key.readArmored(this.privkey).keys[0];
      this.decryptedPrivKeyObj.decrypt(this.passphrase);
    }
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

  async makeEncrypt(data: any): Promise<string> {
    this.options = {
      data: data,
      publicKeys: openpgp.key.readArmored(this.pubkey).keys,
      privateKeys: [this.decryptedPrivKeyObj]
    };
    return openpgp.encrypt(this.options).then((ciphertext) => {
      return ciphertext.data;
    });
  }

  async makeDecrypt(str, privkey, pubkey, passphrase) {
    if (str) {
      const privKeyObj = openpgp.key.readArmored(privkey).keys[0];
      if (!privKeyObj) {
        return 'privkey Error';
      }
      if (!openpgp.message.readArmored(str)) {
        return 'message type Error';
      }
      await privKeyObj.decrypt(passphrase);
      this.options = {
        message: openpgp.message.readArmored(str),
        publicKeys: openpgp.key.readArmored(pubkey).keys,
        privateKeys: [privKeyObj]
      };
      return openpgp.decrypt(this.options).then((plaintext) => {
        return plaintext.data;
      });
    }
  }
}
