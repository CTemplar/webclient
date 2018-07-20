import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, MailBoxesState } from '../datatypes';
import { Logout, SetDecryptedKey, SetDecryptInProgress, UpdatePGPContent } from '../actions';

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

  constructor(private store: Store<AppState>) {

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
    this.pgpWorker = new Worker('/assets/static/pgp-worker.js');
    this.pgpEncryptWorker = new Worker('/assets/static/pgp-worker-encrypt.js');
  }

  initializeWorker() {
    if (this.privkey && !this.decryptedPrivKeyObj && !this.decryptInProgress) {
      const userKey = sessionStorage.getItem('user_key');
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
          this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: false, decryptedContent: event.data.decryptedContent }));
        }
      });
      this.pgpEncryptWorker.onmessage = ((event: MessageEvent) => {
        if (event.data.encrypted) {
          this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: false, encryptedContent: event.data.encryptedContent }));
        }
      });
    }
  }

  encrypt(content, publicKeys: any[] = []) {
    this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: true, encryptedContent: null }));

    publicKeys.push(this.pubkey);
    this.pgpEncryptWorker.postMessage({ content: content, encrypt: true, publicKeys: publicKeys });
  }

  decrypt(content) {
    if (this.decryptedPrivKeyObj) {
      this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: true, decryptedContent: null }));
      this.pgpWorker.postMessage({ content: content, decrypt: true });
    } else {
      setTimeout(() => {
        this.decrypt(content);
      }, 1000);
    }
  }

}
