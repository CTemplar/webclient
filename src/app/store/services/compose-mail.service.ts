import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClearDraft, CreateMail, SendMail } from '../actions';
import { AppState, ComposeMailState, Draft, DraftState } from '../datatypes';
import { OpenPgpService } from './openpgp.service';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;

  constructor(private store: Store<AppState>,
              private openPgpService: OpenPgpService) {
    this.store.select((state: AppState) => state.composeMail)
      .subscribe((response: ComposeMailState) => {
        Object.keys(response.drafts).forEach((key) => {
          const draftMail: Draft = response.drafts[key];
          if (draftMail.draft) {
            if (draftMail.shouldSave && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              this.store.dispatch(new CreateMail({...draftMail}));
            } else if (draftMail.shouldSend && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              this.store.dispatch(new SendMail({...draftMail}));
            } else if (draftMail.shouldSend && this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
              this.openPgpService.encrypt(draftMail.id, draftMail.draft.content, draftMail.usersKeys.map(item => item.public_key));
            }
          }
          if (draftMail.isClosed && !draftMail.shouldSend && !draftMail.shouldSave && !draftMail.inProgress) {
            this.store.dispatch(new ClearDraft(draftMail));
          }
        });

        this.drafts = {...response.drafts};
      });

  }

}
