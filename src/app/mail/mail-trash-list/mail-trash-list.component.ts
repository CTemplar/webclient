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
  // Public property of boolean type set false by default
  constructor(private store: Store<any>, private openPgpService: OpenPgpService) {
    this.getMailsState$ = this.store.select(getMails);

  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
    });
    this.getMails();

  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: 'trash' }));
  }


  ngOnDestroy() {}
}
