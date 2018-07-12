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
  }

  initializeWorker() {
    if (this.privkey && !this.decryptedPrivKeyObj && !this.decryptInProgress) {
      const userKey = sessionStorage.getItem('user_key');
      if (!userKey) {
        this.store.dispatch(new Logout());
        return;
      }

      this.store.dispatch(new SetDecryptInProgress(true));

      this.pgpWorker = new Worker('/assets/static/pgp-worker.js');
      this.pgpWorker.postMessage({
        privkey: this.privkey,
        user_key: atob(userKey),
      });
      this.pgpWorker.onmessage = ((event: MessageEvent) => {
        if (event.data.key) {
          this.decryptedPrivKeyObj = event.data.key;
          this.store.dispatch(new SetDecryptedKey({ decryptedKey: this.decryptedPrivKeyObj }));
        } else if (event.data.encryptedContent) {
          this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: false, encryptedContent: event.data.encryptedContent }));
        } else if (event.data.decryptedContent) {
          this.store.dispatch(new UpdatePGPContent({ isPGPInProgress: false, decryptedContent: event.data.decryptedContent }));
        }
      });
    }
  }

  encrypt(content, publicKeys: any = this.pubkey) {
    this.pgpWorker.postMessage({ content: content, encrypt: true, publicKeys: publicKeys });
  }

  decrypt(content) {
    this.pgpWorker.postMessage({ content: content, decrypt: true });
  }

}
