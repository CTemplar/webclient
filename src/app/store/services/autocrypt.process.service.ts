import { Injectable } from '@angular/core';

import {
  AppState,
  AutocryptPreferEncryptType,
  Contact,
  ContactsState,
  Draft,
  GlobalPublicKey,
  MailBoxesState,
  UIRecommendationValue,
  AutocryptEncryptDetermine,
  AutocryptEncryptDetermineForSingle,
} from '../datatypes';
import { Mailbox } from '../models';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import * as parseEmail from 'email-addresses';

@Injectable()
export class AutocryptProcessService {
  private mailboxes: Mailbox[] = [];
  private contacts: Contact[] = [];
  private senderMailbox: Mailbox;
  constructor(private store: Store<AppState>) {
    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.mailboxes = mailBoxesState.mailboxes;
      });
    this.store
      .select(state => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contacts = contactsState.contacts;
      });
  }

  /**
   * Lanuch Autocrypt Default Encryption checking based on
   * https://autocrypt.org/level1.html#provide-a-recommendation-for-message-encryption
   * @param draftMail
   * @param usersKeys
   */
  decideAutocryptDefaultEncryption(draftMail: Draft, usersKeys: Map<string, GlobalPublicKey>): AutocryptEncryptDetermine {
    if (draftMail.draft) {
      // Check sender mailbox is enabled for Autocrypt
      if (this.mailboxes.length > 0) {
        this.senderMailbox = this.mailboxes.find(mailbox => mailbox.id === draftMail.draft.mailbox);
        if (!this.senderMailbox || !this.senderMailbox.is_autocrypt_enabled) {
          return false;
        }
      }
      const receivers: string[] = [
        ...draftMail.draft.receiver.map(receiver => receiver),
        ...draftMail.draft.cc.map(cc => cc),
        ...draftMail.draft.bcc.map(bcc => bcc),
      ];
      let receiversStatus = new Map<string, AutocryptEncryptDetermineForSingle>();
      receivers.forEach(receiver => {
        const parsedEmail = parseEmail.parseOneAddress(receiver) as parseEmail.ParsedMailbox;
        const contact = this.contacts.find(contact => contact.email === parsedEmail.address)
        if (!contact) {
          receiversStatus.set(contact.email, {
            recommendationValue: UIRecommendationValue.DISABLE,
            encrypt: false,
          });
        } else {
          if (usersKeys.has(parsedEmail.address) && usersKeys.get(parsedEmail.address).key && usersKeys.get(parsedEmail.address).key.length > 0) {
            // Completed checking STEP 1 (Determine if encryption is possible),
            // the result is OK, will jump into the next process
            // https://autocrypt.org/level1.html#determine-if-encryption-is-possible
            const processResult = this.launchProcessForCheckAutocryptPossible(contact);
            receiversStatus.set(contact.email, processResult);
          } else {
            receiversStatus.set(contact.email, {
              recommendationValue: UIRecommendationValue.DISABLE,
              encrypt: false,
            });
          }
        }
      });
      const encryptTotally = [ ...receiversStatus.keys() ].every(key => receiversStatus.get(key).encrypt);
      return {
        encryptTotally,
        receiversStatus,
      }
    }
  }

  private launchProcessForCheckAutocryptPossible(contact: Contact): any {
    // STEP 2
    // Checking Preliminary Recommendation
    // https://autocrypt.org/level1.html#preliminary-recommendation

    // If autocrypt_timestamp is more than 35 days older than last_seen, set preliminary-recommendation to discourage.
    // Otherwise, set preliminary-recommendation to available.
    let recommendationValue = UIRecommendationValue.AVAILABLE;
    const MAX_DISCOURAGE_DAY = 35;
    const autocryptTimestamp: Date = new Date(contact.autocrypt_timestamp);
    const lastSeen: Date = new Date(contact.last_seen);
    if (!contact.last_seen && this.dateDiffInDays(autocryptTimestamp, lastSeen) >= MAX_DISCOURAGE_DAY) {
      recommendationValue = UIRecommendationValue.DISCOURAGE;
    }

    // STEP 3
    // Checking whether decide encrypt by default
    // https://autocrypt.org/level1.html#deciding-to-encrypt-by-default

    // If preliminary-recommendation is either available or discourage,
    // and the message is composed as a reply to an encrypted message, or
    // TODO - Skipping now for above condition
    let encrypt = false;
    // If the preliminary-recommendation is available and
    // both peers[to-addr].prefer_encrypt and accounts[from-addr].prefer_encrypt are mutual.
    if (this.senderMailbox.is_autocrypt_enabled && this.senderMailbox.prefer_encrypt === AutocryptPreferEncryptType.MUTUAL && contact.prefer_encrypt === AutocryptPreferEncryptType.MUTUAL) {
      encrypt = true;
    }
    return {
      recommendationValue,
      encrypt
    };
  }

  dateDiffInDays(start: Date, end: Date) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
}
