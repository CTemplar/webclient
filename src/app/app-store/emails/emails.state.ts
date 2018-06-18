// Actions
import { GetMailbox } from "../actions";

// Helpers
import { decrypt, genPgpObj } from "../helpers";

// Models
import { Mailbox } from "../models";

// Ngrx
import { Action, State, StateContext } from "@ngxs/store";

// Services
import { EmailsService } from "../services";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface EmailsStateModel {
  mailbox: Mailbox;
}

@State<EmailsStateModel>({
  name: "emails",
  defaults: {
    mailbox: null
  }
})
export class EmailsState {  
  constructor(private emailsService: EmailsService) {}

  @Action(GetMailbox)
  getMailbox(ctx: StateContext<EmailsStateModel>, { password }: GetMailbox) {
    return this.emailsService.getMailbox().then(async data => {
      await data.map(async mailbox => {
        mailbox.keyObj = await genPgpObj(password, mailbox.private_key);
        mailbox.messages.map(async message => {
          message.json = JSON.parse(
            await decrypt(message.content, mailbox.keyObj)
          );
        });
      });
      ctx.patchState({ mailbox: data });
    });
  }
}
