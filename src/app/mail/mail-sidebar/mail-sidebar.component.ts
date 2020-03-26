import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState, AuthState, MailBoxesState, MailState, PlanType, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { DOCUMENT } from '@angular/common';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { NotificationService } from '../../store/services/notification.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import {
  ClearMailsOnLogout,
  GetMails,
  GetMailsSuccess,
  GetUnreadMailsCount,
  GetUnreadMailsCountSuccess,
  ReadMailSuccess
} from '../../store/actions';
import { filter } from 'rxjs/operators';
import { WebsocketService } from '../../shared/services/websocket.service';
import { WebSocketState } from '../../store';
import { Title } from '@angular/platform-browser';
import { PushNotificationOptions, PushNotificationService } from '../../shared/services/push-notification.service';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { getMailSidebarShortcuts, SharedService } from '../../store/services';
import { darkModeCss, PRIMARY_WEBSITE } from '../../shared/config';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  LIMIT = 3;
  EMAIL_LIMIT = 20;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public userState: UserState;

  mailState: MailState;
  mailFolderType = MailFolderType;
  currentRoute: string;

  isMenuOpened: boolean;
  isSidebarOpened: boolean;
  customFolders: Folder[] = [];
  currentMailbox: Mailbox;
  shortcuts: ShortcutInput[] = [];
  @ViewChild('input') input: ElementRef;
  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

  currentPlan: PlanType;
  currentFolder: MailFolderType;
  primaryWebsite = PRIMARY_WEBSITE;
  private forceLightMode: boolean;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              config: NgbDropdownConfig,
              private breakpointsService: BreakpointsService,
              private composeMailService: ComposeMailService,
              private notificationService: NotificationService,
              private router: Router,
              private websocketService: WebsocketService,
              private pushNotificationService: PushNotificationService,
              private titleService: Title,
              private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document,
              private sharedService: SharedService,
              private cdr: ChangeDetectorRef) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
    const nextPage = localStorage.getItem('nextPage');
    if (nextPage) {
      localStorage.setItem('nextPage', '');
      this.router.navigateByUrl(nextPage);
    }
    this.currentRoute = router.url;

    this.store.dispatch(new GetUnreadMailsCount());
    this.websocketService.connect();

    // listen to web sockets events of new emails from server.
    this.store.select(state => state.webSocket).pipe(untilDestroyed(this))
      .subscribe((webSocketState: WebSocketState) => {
        if (webSocketState.message && !webSocketState.isClosed) {
          if (webSocketState.message.mail) {
            if (this.currentRoute && this.currentRoute.indexOf('/message/') < 0) {
              this.store.dispatch(new GetMailsSuccess({
                limit: this.EMAIL_LIMIT,
                offset: 0,
                folder: webSocketState.message.folder,
                folders: webSocketState.message.folders,
                read: false,
                mails: [webSocketState.message.mail],
                total_mail_count: webSocketState.message.total_count,
              }));
            }
            if (webSocketState.message.folder !== MailFolderType.SPAM) {
              this.showNotification(webSocketState.message.mail, webSocketState.message.folder);
              this.updateUnreadCount(webSocketState);
            }
          } else if (webSocketState.message.is_outbox_mail_sent) {
            this.store.dispatch(new GetUnreadMailsCountSuccess(
              { ...webSocketState.message.unread_count, updateUnreadCount: true, }));
            if (this.mailState.currentFolder === MailFolderType.OUTBOX) {
              this.store.dispatch(new GetMails({ limit: this.LIMIT, offset: 0, folder: MailFolderType.OUTBOX }));
            }

          } else if (webSocketState.message.marked_as_read !== null) {
            this.updateUnreadCount(webSocketState);
            this.store.dispatch(new ReadMailSuccess({
              ids: webSocketState.message.ids.join(','),
              read: webSocketState.message.marked_as_read,
            }));
          }
        }
      });
    this.store.select(state => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (!authState.isAuthenticated) {
          this.websocketService.disconnect();
          this.store.dispatch(new ClearMailsOnLogout());
        }
      });
  }

  ngOnInit() {

    const isGranted: any = this.pushNotificationService.permission;
    if (!this.pushNotificationService.isGranted()) {
      setTimeout(() => {
        this.pushNotificationService.requestPermission();
      }, 3000);
    }

    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.currentPlan = user.settings.plan_type || PlanType.FREE;
        this.EMAIL_LIMIT = this.userState.settings.emails_per_page ? this.userState.settings.emails_per_page : 20;
        this.customFolders = user.customFolders;
        if (this.breakpointsService.isSM() || this.breakpointsService.isXS()) {
          this.LIMIT = this.customFolders.length;
        }
        this.handleDarkMode(user.settings.is_night_mode);
        this.handleCustomCss(user.settings.custom_css);
      });

    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailboxes: MailBoxesState) => {
        this.currentMailbox = mailboxes.currentMailbox;
      });

    this.store.select(state => state.mail).pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
        this.currentFolder = mailState.currentFolder;
        this.updateTitle();

      });
    this.router.events.pipe(untilDestroyed(this), filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        if (event.url === '/mail/contacts') {
          this.updateTitle(`${this.capitalize(event.url.split('/mail/')[1])} - CTemplar: Armored Email`);
        } else if (event.url.indexOf('/mail/settings/') > -1) {
          this.updateTitle(`Settings - CTemplar: Armored Email`);
        }
      });
    this.activatedRoute.queryParams.pipe(untilDestroyed(this))
      .subscribe((params: Params) => {
        this.forceLightMode = params.lightMode;
        if (this.forceLightMode) {
          this.handleDarkMode(false);
        }
      });
  }

  ngAfterViewInit(): void {
    this.shortcuts = getMailSidebarShortcuts(this);
    this.cdr.detectChanges();
  }

  private updateUnreadCount(webSocketState: WebSocketState) {
    this.store.dispatch(new GetUnreadMailsCountSuccess({ ...webSocketState.message.unread_count, updateUnreadCount: true }));
  }

  updateTitle(title: string = null) {
    // Set tab title
    if (!title) {
      title = `${this.mailState.currentFolder ? this.capitalize(this.mailState.currentFolder) : ''} `;
      if (this.mailState.currentFolder && this.mailState.unreadMailsCount[this.mailState.currentFolder] &&
        (this.mailState.currentFolder === 'inbox' || this.customFolders.some(folder => this.mailState.currentFolder === folder.name))) {
        title += `(${this.mailState.unreadMailsCount[this.mailState.currentFolder]}) - `;
      } else if (this.mailState.currentFolder) {
        title += ' - ';
      }
      title += 'CTemplar: Armored Email';
    }
    this.titleService.setTitle(title);
  }

  capitalize(s) {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  handleDarkMode(isNightMode) {
    if (isNightMode && !this.forceLightMode) {
      document.getElementById('night-mode').innerHTML = darkModeCss;
    } else {
      document.getElementById('night-mode').innerHTML = '';
    }
  }

  handleCustomCss(customCss: string) {
    document.getElementById('ctemplar-custom-css').innerHTML = customCss;
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 5 folders per account
   */
  // == Open NgbModal
  createFolder() {
    this.sharedService.openCreateFolderDialog(this.userState.isPrime, this.customFolders);
  }

  // == Show mail compose modal
  openComposeMailDialog() {
    this.composeMailService.openComposeMailDialog({ isFullScreen: this.userState.settings.is_composer_full_screen });
  }

  toggleDisplayLimit(totalItems) {
    if (this.LIMIT === totalItems) {
      this.LIMIT = 3;
    } else {
      this.LIMIT = totalItems;
    }
  }

  toggleMenu(event?: any) { // click handler
    if (this.breakpointsService.isXS()) {
      if (this.isMenuOpened) {
        this.document.body.classList.remove('menu-open');
        this.isMenuOpened = false;
      }
      if (this.document.body.classList.contains('menu-open')) {
        this.isMenuOpened = true;
      }
    } else if (this.breakpointsService.isSM() || this.breakpointsService.isMD()) {
      if (event) {
        this.isSidebarOpened = false;
      } else {
        this.isSidebarOpened = !this.isSidebarOpened;
      }
    }
  }

  showNotification(mail: Mail, folder: string) {
    const title = mail.sender_display.name;
    const options = new PushNotificationOptions();
    options.body = 'You have received a new email';
    options.icon = 'https://mail.ctemplar.com/assets/images/media-kit/mediakit-logo4.png';

    this.pushNotificationService.create(title, options).subscribe((notif) => {
        if (notif.event.type === 'click') {
          notif.notification.close();
          window.open(`/mail/${folder}/page/1/message/${mail.id}`, '_blank');
        }
      },
      (err) => {
        console.log(err);
      });
  }


  ngOnDestroy(): void {
    this.titleService.setTitle('CTemplar: Armored Email');
  }
}
