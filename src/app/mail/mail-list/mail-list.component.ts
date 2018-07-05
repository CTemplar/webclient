// Angular
import { Component, OnInit } from '@angular/core';

// Models
import { Mail } from '../../store/models';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Store
import { Store } from '@ngrx/store';
import { getMails } from '../../store/selectors';
import { GetMails, GetMailboxes, FinalLoading } from '../../store/actions';
import { OpenPgpService } from '../../store/services/openpgp.service';

declare var openpgp;

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {
  mails: Mail[];
  getMailsState$: Observable<any>;
  getMailboxesState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<any>, private openPgpService: OpenPgpService) {
    this.getMailsState$ = this.store.select(getMails);
    // this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
    // .subscribe((mailboxes) => {
    //   console.log(mailboxes);
    // });
  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });
    this.getMailboxes();
    this.getMails();

    // this.openPgpService.makeDecrypt(this..value).then((key) => {
    //   // this.store.dispatch(new SignUp(this.signupForm.value));
    //   this.fingerprint = key.fingerprint;
    //   this.privkey = key.privkey;
    //   this.pubkey = key.pubkey;
    // });
  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0 }));
  }

  getMailboxes() {
    this.store.dispatch(new GetMailboxes({ limit: 1000, offset: 0 }));
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() { // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }

}
