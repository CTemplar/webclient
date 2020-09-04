import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, InviteCode, UserState } from '../../../store/datatypes';
import { GenerateInviteCode, GetInviteCodes } from '../../../store/actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PRIMARY_WEBSITE } from '../../../shared/config';
import { SharedService } from '../../../store/services';

@UntilDestroy()
@Component({
  selector: 'app-invite-codes',
  templateUrl: './invite-codes.component.html',
  styleUrls: ['./invite-codes.component.scss', '../mail-settings.component.scss']
})
export class InviteCodesComponent implements OnInit, OnDestroy {
  inviteCodes: InviteCode[] = [];
  inProgress: boolean;
  primaryWebsite = PRIMARY_WEBSITE;
  isPrime: boolean;
  isLoaded: boolean;

  constructor(private store: Store<AppState>, private sharedService: SharedService) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        this.inviteCodes = userState.inviteCodes;
        this.inProgress = userState.inProgress;
        this.isPrime = userState.isPrime;
        if (this.isPrime && !this.isLoaded) {
          this.isLoaded = true;
          this.store.dispatch(new GetInviteCodes());
        }
      });
  }

  generateCode() {
    this.store.dispatch(new GenerateInviteCode());
  }

  copyToClipboard(value: string) {
    this.sharedService.copyToClipboard(value);
  }

  ngOnDestroy(): void {}
}
