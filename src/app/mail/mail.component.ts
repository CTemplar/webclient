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
import { ActivatedRoute, Router } from '@angular/router';
import * as Sentry from '@sentry/browser';
import { BehaviorSubject } from 'rxjs';

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
import { GetOrganizationUsers } from '../store/actions/organization.action';
import { SENTRY_DSN, KEY_LEFT_CONTROL } from '../shared/config';
import { KeyManageService } from '../shared/services/key-manage.service';
import { UserSelectManageService } from '../shared/services/user-select-manage.service';

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

  @ViewChild('mailboxContentOuter') mailboxContentOuter: any;

  private isLoadedData: boolean;

  autoresponder: AutoResponder = {};

  autoresponder_status = false;

  currentDate: string;

  canLoadNotification = true;

  hideNotification: boolean;

  notificationMessage: string;

  isKeyDownCtrlBtn = false;

  isEnalbedUserSelect$ = new BehaviorSubject<boolean>(false);

  exportedDataLink: string;

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
    private composeMailService: ComposeMailService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private keyManageService: KeyManageService,
    private userSelectManageService: UserSelectManageService,
  ) {
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  ngOnInit() {
    this.userSelectManageService.userSelectPosibilityState$.pipe(untilDestroyed(this)).subscribe(isPossible => {
      if (isPossible) {
        this.mailboxContentOuter?.nativeElement.classList.remove('disable-user-select');
      } else {
        this.mailboxContentOuter?.nativeElement.classList.add('disable-user-select');
      }
    });
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
          console.log('userState', userState);
          if (userState?.export_zip_ready) {
            this.exportedDataLink = `https://attachments.ctemplar.com/ctemplar/export-data/${userState?.user_uuid}.zip`;
          }
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
          this.autoresponder_status = !!(
            this.autoresponder.autoresponder_active ||
            (this.autoresponder.vacationautoresponder_active &&
              this.autoresponder.vacationautoresponder_message &&
              this.autoresponder.start_date &&
              this.autoresponder.end_date &&
              this.currentDate >= this.autoresponder.start_date)
          );
        }
        if (userState.has_notification && this.canLoadNotification) {
          this.store.dispatch(new GetNotification());
          this.canLoadNotification = false;
        }
        if (userState.notifications) {
          this.notificationMessage = userState.notifications[0].message;
        }
      });

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
    this.composeMailService.destroyAllComposeMailDialogs();
  }

  navigateToPage(path: string) {
    this.router.navigateByUrl(path);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === KEY_LEFT_CONTROL || event.metaKey) {
      this.isKeyDownCtrlBtn = false;
    } else if (
      event.code === 'KeyA' &&
      this.isKeyDownCtrlBtn &&
      (!this.composeMailService.componentRefList || this.composeMailService.componentRefList.length === 0)
    ) {
      this.keyManageService.onPressCtrlAKey();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === KEY_LEFT_CONTROL || event.metaKey) {
      this.isKeyDownCtrlBtn = true;
    }
  }
}
