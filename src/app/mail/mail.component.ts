import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/browser';

import {
  AccountDetailsGet,
  BlackListGet,
  GetDomains,
  GetDomainsSuccess,
  GetFilters,
  GetInvoices,
  GetMailboxes,
  GetNotification,
  SaveAutoResponder,
  WhiteListGet,
  CardGet,
  ContactsGet,
} from '../store/actions';
import { TimezoneGet } from '../store/actions/timezone.action';
import { AppState, AutoResponder, UserState } from '../store/datatypes';
import { SharedService } from '../store/services';
import { ComposeMailService } from '../store/services/compose-mail.service';
import { GetOrganizationUsers } from '../store/organization.store';
import { SENTRY_DSN } from '../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MailComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;

  @ViewChild('composeMailContainer', { read: ViewContainerRef }) composeMailContainer: ViewContainerRef;

  private isLoadedData: boolean;

  autoresponder: AutoResponder = {};

  autoresponder_status = false;

  currentDate: string;

  canLoadNotification = true;

  hideNotification: boolean;

  notificationMessage: string;

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    private composeMailService: ComposeMailService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  ngOnInit() {
    this.store.dispatch(new AccountDetailsGet());
    /**
     * Get user's state from store
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        if (userState.isLoaded && !this.isLoadedData) {
          // Initialize Sentry according to user's setting after login
          if (userState.settings.is_enable_report_bugs) {
            Sentry.init({
              dsn: SENTRY_DSN,
              enabled: true,
            });
          }
          this.isLoadedData = true;
          this.store.dispatch(new GetMailboxes());
          this.store.dispatch(new TimezoneGet());

          setTimeout(() => {
            this.store.dispatch(new GetFilters());
            this.store.dispatch(new WhiteListGet());
            this.store.dispatch(new BlackListGet());
            this.store.dispatch(new GetInvoices());
            this.store.dispatch(new CardGet());
            this.store.dispatch(new ContactsGet());
          }, 500);

          if (userState.isPrime) {
            setTimeout(() => {
              this.store.dispatch(new GetDomains());
              this.store.dispatch(new GetOrganizationUsers());
            }, 1000);
          } else {
            this.store.dispatch(new GetDomainsSuccess([]));
          }
        }
        if (userState.autoresponder) {
          this.autoresponder = userState.autoresponder;
          if (
            this.autoresponder.autoresponder_active ||
            (this.autoresponder.vacationautoresponder_active &&
              this.autoresponder.vacationautoresponder_message &&
              this.autoresponder.start_date &&
              this.autoresponder.end_date &&
              this.currentDate >= this.autoresponder.start_date)
          ) {
            this.autoresponder_status = true;
          } else {
            this.autoresponder_status = false;
          }
        }
        if (userState.has_notification && this.canLoadNotification) {
          this.store.dispatch(new GetNotification());
          this.canLoadNotification = false;
        }
        if (userState.notifications) {
          this.notificationMessage = userState.notifications[0].message;
        }
      });

    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isMail.emit(true);
    this.composeMailService.getWindowWidth(window.innerWidth);
  }

  // get window width as real time when change screen's size
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.composeMailService.getWindowWidth(window.innerWidth);
  }

  endAutoResponder() {
    this.autoresponder.autoresponder_active = false;
    this.autoresponder.vacationautoresponder_active = false;
    this.store.dispatch(new SaveAutoResponder(this.autoresponder));
    this.autoresponder_status = false;
  }

  ngAfterViewInit() {
    this.composeMailService.initComposeMailContainer(this.composeMailContainer);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isMail.emit(false);
    this.composeMailService.destroyAllComposeMailDialogs();
  }

  navigateToPage(path: string) {
    this.router.navigateByUrl(path);
  }
}
