import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { AppState, Settings, UserState } from '../../../store/datatypes';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-autoresponder',
  templateUrl: './mail-autoresponder.component.html',
  styleUrls: ['./mail-autoresponder.component.scss', '../mail-settings.component.scss']
})
export class MailAutoresponderComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  userState: UserState;
  settings: Settings;
  errorMessage: string;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
      });
  }

  ngOnDestroy(): void {
  }

}
