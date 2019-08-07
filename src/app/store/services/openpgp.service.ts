import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ChangePassphraseSuccess,
  GetMailboxesSuccess,
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
import { AppState, AuthState, MailBoxesState, SecureContent, Settings, UserState } from '../datatypes';
import { UsersService } from './users.service';
import { Mailbox } from '../models';
import { PRIMARY_DOMAIN } from '../../shared/config';

@Injectable()
export class OpenPgpService {
  options: any;
  encrypted: any;
  private pubkeys: any;
  private privkeys: any;
  private decryptedPrivKeys: any;
  private decryptInProgress: boolean;
  private pgpWorker: Worker;
  private isAuthenticated: boolean;
  private userKeys: any;
  private mailboxes: Mailbox[];
  private userSettings: Settings;

  constructor(private store: Store<AppState>,
              private usersService: UsersService) {

    this.pgpWorker = new Worker('/assets/static/pgp-worker.js');
    this.listenWorkerPostMessages();

    this.store.select(state => state.mailboxes)
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (mailBoxesState.mailboxes.length > 0) {
          this.mailboxes = mailBoxesState.mailboxes;
          this.privkeys = this.privkeys || {};
          this.pubkeys = this.pubkeys || {};
          let hasNewPrivateKey = false;
          mailBoxesState.mailboxes.forEach(mailbox => {
            if (!this.privkeys[mailbox.id]) {
              this.privkeys[mailbox.id] = mailbox.private_key;
              hasNewPrivateKey = true;
            }
            this.pubkeys[mailbox.id] = mailbox.public_key;
          });
          if (hasNewPrivateKey) {
            this.decryptPrivateKeys();
          }
        }
        this.decryptInProgress = mailBoxesState.decryptKeyInProgress;
      });

    this.store.select((state: AppState) => state.auth)
      .subscribe((authState: AuthState) => {
        if (this.isAuthenticated && !authState.isAuthenticated) {
          this.clearData();
        }
        this.isAuthenticated = authState.isAuthenticated;
      });
    this.store.select((state: AppState) => state.user)
      .subscribe((userState: UserState) => {
        this.userSettings = userState.settings;
      });
  }

  decryptPrivateKeys(privKeys?: any, password?: string) {
    const userKey = password ? btoa(password) : this.usersService.getUserKey();
    if (!userKey) {
      this.store.dispatch(new Logout());
      return;
    }
    this.privkeys = privKeys ? privKeys : this.privkeys;
    this.store.dispatch(new SetDecryptInProgress(true));

    this.pgpWorker.postMessage({
      decryptPrivateKeys: true,
      privkeys: Object.keys(this.privkeys).map(key => ({ mailboxId: key, privkey: this.privkeys[key] })),
      user_key: atob(userKey)
    });
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
        } else {
          this.userKeys = event.data.keys;
        }
      } else if (event.data.decryptPrivateKeys) {
        this.decryptedPrivKeys = event.data.keys;
        this.store.dispatch(new SetDecryptedKey({ decryptedKey: this.decryptedPrivKeys }));
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
      } else if (event.data.changePassphrase) {
        event.data.keys.forEach(item => {
          item.public_key = item.public_key ? item.public_key : this.pubkeys[item.mailbox_id];
        });
        this.store.dispatch(new ChangePassphraseSuccess(event.data.keys));
      } else if (event.data.encrypted) {
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

  encrypt(mailboxId, draftId, mailData: SecureContent, publicKeys: any[] = []) {
    this.store.dispatch(new UpdatePGPEncryptedContent({ isPGPInProgress: true, encryptedContent: {}, draftId }));

    publicKeys.push(this.pubkeys[mailboxId]);
    if (!this.userSettings.is_subject_encrypted) {
      mailData.subject = null;
    }
    this.pgpWorker.postMessage({ mailData, publicKeys, encrypt: true, callerId: draftId });
  }

  encryptSecureMessageContent(content, publicKeys: any[]) {
    this.store.dispatch(new UpdateSecureMessageEncryptedContent({ inProgress: true, encryptedContent: null }));

    this.pgpWorker.postMessage({ content, publicKeys, encryptSecureMessageReply: true });
  }

  decrypt(mailboxId, mailId, mailData: SecureContent) {
    if (this.decryptedPrivKeys) {
      if (!mailData.isSubjectEncrypted) {
        mailData.subject = null;
      }
      this.store.dispatch(new UpdatePGPDecryptedContent({ id: mailId, isPGPInProgress: true, decryptedContent: {} }));
      this.pgpWorker.postMessage({ mailboxId, mailData, decrypt: true, callerId: mailId });
    } else {
      setTimeout(() => {
        this.decrypt(mailboxId, mailId, mailData);
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

  clearData(publicKeys?: any) {
    this.decryptedPrivKeys = null;
    this.pubkeys = null;
    this.privkeys = null;
    this.userKeys = null;
    this.store.dispatch(new SetDecryptedKey({ decryptedKey: null }));
    this.pgpWorker.postMessage({ clear: true });

    if (publicKeys) {
      this.mailboxes.forEach(item => {
        item.public_key = publicKeys[item.id];
      });
      this.store.dispatch(new GetMailboxesSuccess(this.mailboxes));
    }
  }

  generateUserKeys(username: string, password: string, domain: string = PRIMARY_DOMAIN) {
    if (username.split('@').length > 1) {
      domain = username.split('@')[1];
      username = username.split('@')[0];
    }
    this.userKeys = null;
    const options = {
      userIds: [{ name: `${username}_${domain}`, email: `${username}@${domain}` }],
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

  waitForPGPKeys(self: any, callbackFn: string) {
    setTimeout(() => {
      if (this.getUserKeys()) {
        self[callbackFn]();
        return;
      }
      this.waitForPGPKeys(self, callbackFn);
    }, 500);
  }

  changePassphrase(passphrase: string, deleteData: boolean, username: string) {
    this.pgpWorker.postMessage({ passphrase, deleteData, username, mailboxes: this.mailboxes, changePassphrase: true });
  }

  revertChangedPassphrase(passphrase: string, deleteData: boolean) {
    if (!deleteData) {
      this.pgpWorker.postMessage({ passphrase, revertPassphrase: true });
    }
  }

}
