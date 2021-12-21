import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, InviteCode, UserState } from '../../../store/datatypes';
import { GenerateInviteCode, GetInviteCodes } from '../../../store/actions';
import { PRIMARY_WEBSITE } from '../../../shared/config';
import { SharedService } from '../../../store/services';

@UntilDestroy()
@Component({
  selector: 'app-invite-codes',
  templateUrl: './invite-codes.component.html',
  styleUrls: ['./invite-codes.component.scss', '../mail-settings.component.scss'],
})
export class InviteCodesComponent implements OnInit {
  inviteCodes: InviteCode[] = [];

  inProgress: boolean;

  primaryWebsite = PRIMARY_WEBSITE;

  isPrime: boolean;

  isLoaded: boolean;

  @Output() onAnchored = new EventEmitter<any>();

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

  onAnchoredLink() {
    this.onAnchored.emit();
    // const elmnt = document.getElementById(id);
    // elmnt.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
