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

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-trash-list',
  templateUrl: './mail-trash-list.component.html',
  styleUrls: ['./mail-trash-list.component.scss']
})
export class MailTrashListComponent implements OnInit, OnDestroy {
  mails: Mail[];

  getMailsState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<any>, private openPgpService: OpenPgpService) {
    this.getMailsState$ = this.store.select(getMails);

  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
      console.log(this.mails);
    });
    this.getMails();

  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: 'trash' }));
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() { // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }

  ngOnDestroy() {}
}
