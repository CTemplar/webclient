import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthState, MailBoxesState } from '../datatypes';
import { Logout, SetDecryptedKey, SetDecryptInProgress, UpdatePGPEncryptedContent, UpdatePGPDecryptedContent } from '../actions';
import { UsersService } from './users.service';

declare var openpgp;

@Injectable()
export class OpenPgpService {
  options: any;
  encrypted: any;
  private pubkey: any;
  private privkey: any;
  private decryptedPrivKeyObj: any;
  private decryptInProgress: boolean;
  private pgpWorker: Worker;
  private pgpEncryptWorker: Worker;
  private isAuthenticated: boolean;

  constructor(private store: Store<AppState>,
              private usersService: UsersService) {

    this.pgpWorker = new Worker('/assets/static/pgp-worker.js');
    this.pgpEncryptWorker = new Worker('/assets/static/pgp-worker-encrypt.js');

    this.store.select(state => state.mailboxes)
      .subscribe((response: MailBoxesState) => {
        // TODO: replace mailboxes[0] with the mailbox selected by user
        if (response.currentMailbox) {
          this.pubkey = response.currentMailbox.public_key;
          this.privkey = response.currentMailbox.private_key;
        }
        this.decryptInProgress = response.decryptKeyInProgress;
        this.initializeWorker();
      });

    this.store.select((state: AppState) => state.auth)
      .subscribe((authState: AuthState) => {
        if (this.isAuthenticated && !authState.isAuthenticated) {
          this.clearData();
        }
        this.isAuthenticated = authState.isAuthenticated;
      });
  }

  initializeWorker() {
    if (this.privkey && !this.decryptedPrivKeyObj && !this.decryptInProgress) {
      const userKey = this.usersService.getUserKey();
      if (!userKey) {
        this.store.dispatch(new Logout());
        return;
      }

      this.store.dispatch(new SetDecryptInProgress(true));

      this.pgpWorker.postMessage({
        privkey: this.privkey,
        user_key: atob(userKey),
      });
      this.pgpWorker.onmessage = ((event: MessageEvent) => {
        if (event.data.key) {
          this.decryptedPrivKeyObj = event.data.key;
          this.store.dispatch(new SetDecryptedKey({ decryptedKey: this.decryptedPrivKeyObj }));
        } else if (event.data.decrypted) {
          this.store.dispatch(new UpdatePGPDecryptedContent({
            id: event.data.callerId,
            isPGPInProgress: false,
            decryptedContent: event.data.decryptedContent
          }));
        }
      });
      this.pgpEncryptWorker.onmessage = ((event: MessageEvent) => {
        if (event.data.encrypted) {
          this.store.dispatch(new UpdatePGPEncryptedContent({
            isPGPInProgress: false,
            encryptedContent: event.data.encryptedContent,
            draftId: event.data.callerId
          }));
        }
      });
    }
  }

  encrypt(draftId, content, publicKeys: any[] = []) {
    this.store.dispatch(new UpdatePGPEncryptedContent({ isPGPInProgress: true, encryptedContent: null, draftId }));

    publicKeys.push(this.pubkey);
    this.pgpEncryptWorker.postMessage({ content: content, encrypt: true, publicKeys: publicKeys, callerId: draftId });
  }

  decrypt(mailId, content) {
    if (this.decryptedPrivKeyObj) {
      this.store.dispatch(new UpdatePGPDecryptedContent({ id: mailId, isPGPInProgress: true, decryptedContent: null }));
      this.pgpWorker.postMessage({ content: content, decrypt: true, callerId: mailId });
    } else {
      setTimeout(() => {
        this.decrypt(mailId, content);
      }, 1000);
    }
  }

  clearData() {
    this.decryptedPrivKeyObj = null;
    this.pubkey = null;
    this.privkey = null;
    this.store.dispatch(new SetDecryptedKey({ decryptedKey: null }));
    this.pgpWorker.postMessage({ clear: true });
  }

  generateUserKeys(username: string, password: string) {
    const options = {
      userIds: [{ name: username, email: `${username}@ctemplar.com` }],
      numbits: 4096,
      passphrase: password
    };
    return openpgp.generateKey(options).then(key => {
      return {
        public_key: key.publicKeyArmored,
        private_key: key.privateKeyArmored,
        fingerprint: openpgp.key.readArmored(key.publicKeyArmored).keys[0].primaryKey.getFingerprint()
      };
    });
  }

}
