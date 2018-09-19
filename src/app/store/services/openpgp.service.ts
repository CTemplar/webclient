import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Logout,
  SetDecryptedKey,
  SetDecryptInProgress,
  UpdatePGPDecryptedContent,
  UpdatePGPEncryptedContent,
  UpdatePGPSshKeys,
  UpdateSecureMessageContent,
  UpdateSecureMessageEncryptedContent,
  UpdateSecureMessageKey
} from '../actions';
import { AppState, AuthState, MailBoxesState } from '../datatypes';
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
  private userKeys: any;

  constructor(private store: Store<AppState>,
              private usersService: UsersService) {

    this.pgpWorker = new Worker('/assets/static/pgp-worker.js');
    this.pgpEncryptWorker = new Worker('/assets/static/pgp-worker-encrypt.js');
    this.listenWorkerPostMessages();

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
        decryptPrivateKey: true,
        privkey: this.privkey,
        user_key: atob(userKey)
      });
    }
  }

  listenWorkerPostMessages() {
    this.pgpWorker.onmessage = ((event: MessageEvent) => {
      if (event.data.generateKeys) {
        if (event.data.forEmail) {
          this.store.dispatch(new UpdatePGPSshKeys({
            isSshInProgress: false,
            keys: event.data.keys,
            draftId: event.data.callerId
          }));
        }
        else {
          this.userKeys = event.data.keys;
        }
      } else if (event.data.decryptPrivateKey) {
        this.decryptedPrivKeyObj = event.data.key;
        this.store.dispatch(new SetDecryptedKey({ decryptedKey: this.decryptedPrivKeyObj }));
      } else if (event.data.decrypted) {
        this.store.dispatch(new UpdatePGPDecryptedContent({
          id: event.data.callerId,
          isPGPInProgress: false,
          decryptedContent: event.data.decryptedContent
        }));
      } else if (event.data.decryptSecureMessageKey) {
        this.store.dispatch(new UpdateSecureMessageKey({
          decryptedKey: event.data.decryptedKey,
          inProgress: false,
          error: event.data.error
        }));
      } else if (event.data.decryptSecureMessageContent) {
        this.store.dispatch(new UpdateSecureMessageContent({ decryptedContent: event.data.decryptedContent, inProgress: false }));
      }
    });
    this.pgpEncryptWorker.onmessage = ((event: MessageEvent) => {
      if (event.data.encrypted) {
        this.store.dispatch(new UpdatePGPEncryptedContent({
          isPGPInProgress: false,
          encryptedContent: event.data.encryptedContent,
          draftId: event.data.callerId
        }));
      } else if (event.data.encryptSecureMessageReply) {
        this.store.dispatch(new UpdateSecureMessageEncryptedContent({
          inProgress: false,
          encryptedContent: event.data.encryptedContent
        }));
      }
    });
  }

  encrypt(draftId, content, publicKeys: any[] = []) {
    this.store.dispatch(new UpdatePGPEncryptedContent({ isPGPInProgress: true, encryptedContent: null, draftId }));

    publicKeys.push(this.pubkey);
    this.pgpEncryptWorker.postMessage({ content: content, encrypt: true, publicKeys: publicKeys, callerId: draftId });
  }

  encryptSecureMessageContent(content, publicKeys: any[]) {
    this.store.dispatch(new UpdateSecureMessageEncryptedContent({ inProgress: true, encryptedContent: null }));

    this.pgpEncryptWorker.postMessage({ content: content, encryptSecureMessageReply: true, publicKeys: publicKeys });
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

  decryptSecureMessagePrivKey(privKey: string, password: string) {
    this.pgpWorker.postMessage({ decryptSecureMessageKey: true, privKey, password });
    this.store.dispatch(new UpdateSecureMessageKey({ decryptedKey: null, inProgress: true }));
  }

  decryptSecureMessageContent(decryptedKey: any, content: string) {
    this.pgpWorker.postMessage({ decryptSecureMessageContent: true, decryptedKey, content });
    this.store.dispatch(new UpdateSecureMessageContent({ decryptedContent: null, inProgress: true }));
  }

  clearData() {
    this.decryptedPrivKeyObj = null;
    this.pubkey = null;
    this.privkey = null;
    this.userKeys = null;
    this.store.dispatch(new SetDecryptedKey({ decryptedKey: null }));
    this.pgpWorker.postMessage({ clear: true });
  }

  generateUserKeys(username: string, password: string) {
    this.userKeys = null;
    const options = {
      userIds: [{ name: username, email: `${username}@ctemplar.com` }],
      numBits: 4096,
      passphrase: password
    };
    this.pgpWorker.postMessage({ options, generateKeys: true });
  }

  generateEmailSshKeys(password: string, draftId: number) {
    this.store.dispatch(new UpdatePGPSshKeys({ isSshInProgress: true, sshKeys: null, draftId }));
    const options = {
      userIds: [{ name: `${draftId}` }],
      numBits: 4096,
      passphrase: password
    };
    this.pgpWorker.postMessage({ options, generateKeys: true, forEmail: true, callerId: draftId });
  }

  getUserKeys() {
    return this.userKeys;
  }

}
