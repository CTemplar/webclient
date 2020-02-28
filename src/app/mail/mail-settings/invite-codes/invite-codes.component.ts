import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, InviteCode, UserState } from '../../../store/datatypes';
import { GenerateInviteCodes, GetInviteCodes } from '../../../store/actions';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PRIMARY_WEBSITE } from '../../../shared/config';

@Component({
  selector: 'app-invite-codes',
  templateUrl: './invite-codes.component.html',
  styleUrls: ['./invite-codes.component.scss', '../mail-settings.component.scss']
})
export class InviteCodesComponent implements OnInit, OnDestroy {
  inviteCodes: InviteCode[] = [];
  inProgess: boolean;
  primaryWebsite = PRIMARY_WEBSITE;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        this.inviteCodes = userState.inviteCodes;
        this.inProgess = userState.inProgress;
      });
    this.store.dispatch(new GetInviteCodes());
  }

  generateCode() {
    this.store.dispatch(new GenerateInviteCodes());
  }

  ngOnDestroy(): void {
  }

}
