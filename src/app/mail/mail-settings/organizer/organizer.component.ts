import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AppState, AuthState, Settings, UserState } from '../../../store/datatypes';

@UntilDestroy()
@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  @Output() onAnchored = new EventEmitter<any>();

  userState: UserState;

  authState: AuthState;

  settings: Settings;

  mailboxes: Array<any>;

  isCreateOrganization = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        if (!user.inProgress) {
          this.settings = user.settings;
        }
      });
  }

  onAddNewOrganization() {
    this.isCreateOrganization = true;
  }

  onAnchoredLink(id: string) {
    this.onAnchored.emit(id);
  }
}
