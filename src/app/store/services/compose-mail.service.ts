import { Injectable } from '@angular/core';
import { AppState, Draft, DraftState, MailState } from '../datatypes';
import { CreateMail, SendMail } from '../actions';
import { Store } from '@ngrx/store';
import { OpenPgpService } from './openpgp.service';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;

  constructor(private store: Store<AppState>,
              private openPgpService: OpenPgpService) {
    this.store.select((state: AppState) => state.mail)
      .subscribe((response: MailState) => {
        Object.keys(response.drafts).forEach((key) => {
          const draftMail: Draft = response.drafts[key];
          if (draftMail.draft) {
            if (draftMail.shouldSave && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              draftMail.shouldSave = false;
              this.store.dispatch(new CreateMail({ ...draftMail }));
            } else if (draftMail.shouldSend && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              draftMail.shouldSend = false;
              this.store.dispatch(new SendMail({ ...draftMail, is_encrypted: true }));
            } else if (draftMail.shouldSend && this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
              this.openPgpService.encrypt(draftMail.id, draftMail.draft.content, draftMail.usersKeys.map(item => item.public_key));
            }

          }
        });

        this.drafts = { ...response.drafts };
      });

  }

}
