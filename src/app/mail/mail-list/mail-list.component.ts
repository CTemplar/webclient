// Angular
import { Component, OnInit } from '@angular/core';

// Models
import { Mail } from '../../models/mail';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Store
import { Store } from '@ngrx/store';
import { getMails } from '../../store/selectors';
import { GetMails } from '../../store/actions/mail.actions';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {
  mails: Mail[];
  getMailsState$: Observable<any>;

  constructor( private store: Store<any> ) {
    this.getMailsState$ = this.store.select(getMails);
  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
    });

    this.getMails();
  }

  getMails() {
    this.store.dispatch(new GetMails({limit: 1000, offset: 0}));
  }

}
