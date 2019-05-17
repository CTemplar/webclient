import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
// Store
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
// Actions
import { AccountDetailsGet, BlackListGet, GetDomains, GetFilters, GetMailboxes, WhiteListGet } from '../store/actions';
import { TimezoneGet } from '../store/actions/timezone.action';
import { AppState, AuthState, UserState } from '../store/datatypes';
import { SharedService } from '../store/services';
import { ComposeMailService } from '../store/services/compose-mail.service';
import { GetOrganizationUsers } from '../store/organization.store';
import { takeUntil } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnDestroy, OnInit, AfterViewInit {
  readonly destroyed$: Observable<boolean>;

  @ViewChild('composeMailContainer', { read: ViewContainerRef }) composeMailContainer: ViewContainerRef;
  private isLoadedData: boolean;

  constructor(private store: Store<AppState>,
              private sharedService: SharedService,
              private composeMailService: ComposeMailService) {
  }

  ngOnInit() {
    this.store.dispatch(new AccountDetailsGet());

    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((userState: UserState) => {
        if (userState.isLoaded && !this.isLoadedData) {
          this.isLoadedData = true;
          this.store.dispatch(new GetMailboxes());
          this.store.dispatch(new TimezoneGet());
          this.store.dispatch(new GetFilters());
          this.store.dispatch(new GetDomains());
          this.store.dispatch(new WhiteListGet());
          this.store.dispatch(new BlackListGet());
          this.store.dispatch(new GetOrganizationUsers());
        }
      });

    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isMail.emit(true);
  }

  ngAfterViewInit() {
    this.composeMailService.initComposeMailContainer(this.composeMailContainer);
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isMail.emit(false);
    this.composeMailService.destroyAllComposeMailDialogs();
  }
}
