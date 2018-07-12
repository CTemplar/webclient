import { Component, OnInit } from '@angular/core';
import { Mail } from '../../store/models/mail.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetMailDetail } from '../../store/actions/mail.actions';
import { Observable } from 'rxjs/Observable';
import { AppState, MailState } from '../../store/datatypes';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss']
})
export class MailDetailComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  mail: Mail;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mail = mailState.mailDetail;
      });

    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getMailDetail(id);
    });
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail(messageId));
  }

  ngOnDestroy(): void {
  }
}
