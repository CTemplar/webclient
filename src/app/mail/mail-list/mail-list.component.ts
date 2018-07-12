// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { getMails } from '../../store/selectors';
import { DeleteMail, GetMails } from '../../store/actions';
import { OpenPgpService } from '../../store/services/openpgp.service';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { MailService } from '../../store/services/mail.service';
import { MoveMail } from '../../store/actions/mail.actions';

declare var openpgp;

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  mails: Mail[];
  checkedMailIds: number[] = [];
  private_key: string;
  public_key: string;
  passphrase: string;
  getMailsState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<any>, private openPgpService: OpenPgpService, private mailService: MailService) {
    this.getMailsState$ = this.store.select(getMails);
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes) => {
        if (mailboxes.mailboxes[0]) {
          this.private_key = mailboxes.mailboxes[0].private_key;
          this.public_key = mailboxes.mailboxes[0].public_key;
        }
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user) => {
        if (user.mailboxes[0]) {
          this.passphrase = user.mailboxes[0].passphrase;
        }
      });
  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
    });
    this.getMails();

  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0 }));
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() { // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }

  rowSelectionChanged(event:any, mail:Mail) {
    if(this.checkedMailIds.indexOf(mail.id) < 0){
      this.checkedMailIds = [...this.checkedMailIds, mail.id];
    } else {
      this.checkedMailIds = this.checkedMailIds.filter(checkedMailId=> checkedMailId !== mail.id);
    }
  }

  moveToTrash() {
    this.store.dispatch(new MoveMail({ids : this.checkedMailIds.join(','), folder: 'trash'}));
  }

  ngOnDestroy() {}
}
