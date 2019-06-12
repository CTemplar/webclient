import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
// Store
import { Store } from '@ngrx/store';
// Actions
import {
    AccountDetailsGet,
    BlackListGet,
    GetDomains,
    GetDomainsSuccess,
    GetFilters,
    GetMailboxes,
    SaveAutoResponder,
    WhiteListGet
} from '../store/actions';
import { TimezoneGet } from '../store/actions/timezone.action';
import {AppState, AutoResponder, UserState} from '../store/datatypes';
import { SharedService } from '../store/services';
import { ComposeMailService } from '../store/services/compose-mail.service';
import { GetOrganizationUsers } from '../store/organization.store';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild('composeMailContainer', { static: false, read: ViewContainerRef }) composeMailContainer: ViewContainerRef;
  private isLoadedData: boolean;
    autoresponder: AutoResponder = {};
    autoresponder_status = false;

  constructor(private store: Store<AppState>,
              private sharedService: SharedService,
              private composeMailService: ComposeMailService) {
  }

  ngOnInit() {
    this.store.dispatch(new AccountDetailsGet());

    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        if (userState.isLoaded && !this.isLoadedData) {
          this.isLoadedData = true;
          this.store.dispatch(new GetMailboxes());
          this.store.dispatch(new TimezoneGet());
          this.store.dispatch(new GetFilters());
          this.store.dispatch(new WhiteListGet());
          this.store.dispatch(new BlackListGet());
          if (userState.isPrime) {
            this.store.dispatch(new GetDomains());
            this.store.dispatch(new GetOrganizationUsers());
          } else {
            this.store.dispatch(new GetDomainsSuccess([]));
          }
        }
                if (userState.autoresponder) {
                    this.autoresponder = userState.autoresponder;
                    if (this.autoresponder.autoresponder_active || this.autoresponder.vacationautoresponder_active) {
                        this.autoresponder_status = true;
                    } else {
                        this.autoresponder_status = false;
                    }
                }
            });

    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isMail.emit(true);
  }

    endAutoResponder() {
        this.autoresponder.autoresponder_active = false;
        this.autoresponder.vacationautoresponder_active = false;
        this.store.dispatch(new SaveAutoResponder(this.autoresponder));
        this.autoresponder_status = false;
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
