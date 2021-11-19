import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AppState, Domain, Settings, UserState } from '../../../../store/datatypes';

@UntilDestroy()
@Component({
  selector: 'app-create-organizer',
  templateUrl: './create-organizer.component.html',
  styleUrls: ['./create-organizer.component.scss'],
})
export class CreateOrganizerComponent implements OnInit {
  userState: UserState;

  settings: Settings;

  isEditing = false;

  organization: any;

  currentStep = 0;

  domainNameForm: FormGroup;

  domains: Domain[] = [];

  // TODO - should be updated after determined the certain Organization model
  newOrganization: any;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Forms
    this.domainNameForm = this.formBuilder.group({
      domainNameCtrl: ['', Validators.required],
    });

    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        if (!user.inProgress) {
          this.settings = user.settings;
          this.domains = user.customDomains;
        }
      });
  }

  finishCreatingOrganization() {}

  onNext() {
    this.currentStep += 1;
  }
}
