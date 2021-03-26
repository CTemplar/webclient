import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  AppState,
  MailBoxesState,
  MailState,
  PlanType,
  UserState,
  NotificationPermission,
} from '../../store/datatypes';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import {
  GetMails,
  GetMailsSuccess,
  GetUnreadMailsCount,
  GetUnreadMailsCountSuccess,
  ReadMailSuccess,
  SettingsUpdateUsedStorage,
  StarredFolderCountUpdate,
  SnackErrorPush,
  DeleteFolder,
} from '../../store/actions';
import { WebsocketService } from '../../shared/services/websocket.service';
import { ThemeToggleService } from '../../shared/services/theme-toggle-service';
import { WebSocketState } from '../../store';
import { PushNotificationOptions, PushNotificationService } from '../../shared/services/push-notification.service';
import { SharedService } from '../../store/services';
import { PRIMARY_WEBSITE } from '../../shared/config';

import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';

@UntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  LIMIT = 3; // limit of displayed custom folder's count

  EMAIL_LIMIT = 20; // limit to display emails

  starredCount = 0; // starred folder count
  // Public property of boolean type set false by default
  public isComposeVisible = false;

  public userState: UserState;

  mailState: MailState;

  mailFolderType = MailFolderType;

  currentRoute: string;

  isloading = true;

  quote: object;

  isMenuOpened: boolean;

  notificationsPermission: string;

  notificationPermissionType = NotificationPermission;

  isSidebarOpened: boolean;

  customFolders: Folder[] = [];

  currentMailbox: Mailbox;

  @ViewChild('input') input: ElementRef;

  currentPlan: PlanType;

  currentFolder: MailFolderType;

  primaryWebsite = PRIMARY_WEBSITE;

  private forceLightMode: boolean;

  @ViewChild('confirmationModal') confirmationModal: any;

  confirmModalRef: NgbModalRef;

  selectedFolderForRemove: Folder;

  constructor(
    private store: Store<AppState>,
    config: NgbDropdownConfig,
    private breakpointsService: BreakpointsService,
    private composeMailService: ComposeMailService,
    private router: Router,
    private websocketService: WebsocketService,
    private pushNotificationService: PushNotificationService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private themeToggleService: ThemeToggleService,
    private modalService: NgbModal,
  ) {
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

    /**
     * Listen to web sockets events to get new emails from server
     */
    this.store
      .select(state => state.webSocket)
      .pipe(untilDestroyed(this))
      .subscribe((webSocketState: WebSocketState) => {
        if (webSocketState.message && !webSocketState.isClosed) {
          if (webSocketState.message.mail) {
            this.store.dispatch(
              new GetMailsSuccess({
                limit: this.EMAIL_LIMIT,
                offset: 0,
                folder: webSocketState.message.folder,
                folders: webSocketState.message.folders,
                read: false,
                mails: [webSocketState.message.mail],
                total_mail_count: webSocketState.message.total_count,
                is_from_socket: true,
              }),
            );
            if (
              webSocketState.message.folder !== MailFolderType.SPAM &&
              this.notificationsPermission === this.notificationPermissionType.GRANTED
            ) {
              this.showNotification(webSocketState.message.mail, webSocketState.message.folder);
            }
            this.updateUnreadCount(webSocketState);
          } else if (webSocketState.message.is_outbox_mail_sent) {
            this.store.dispatch(
              new GetUnreadMailsCountSuccess({ ...webSocketState.message.unread_count, updateUnreadCount: true }),
            );
            if (this.mailState.currentFolder === MailFolderType.OUTBOX) {
              this.store.dispatch(new GetMails({ limit: this.LIMIT, offset: 0, folder: MailFolderType.OUTBOX }));
            }
          } else if (webSocketState.message.hasOwnProperty('used_storage')) {
            this.store.dispatch(new SettingsUpdateUsedStorage(webSocketState.message));
          } else if (webSocketState.message.hasOwnProperty('starred_count')) {
            this.store.dispatch(new StarredFolderCountUpdate(webSocketState.message));
          } else if (webSocketState.message.marked_as_read !== null) {
            this.updateUnreadCount(webSocketState);
            this.store.dispatch(
              new ReadMailSuccess({
                ids: webSocketState.message.ids.join(','),
                read: webSocketState.message.marked_as_read,
              }),
            );
          }
        }
      });
  }

  ngOnInit() {
    this.quote = { content: 'Loading your settings...', author: '' };
    if (this.pushNotificationService.isDefault()) {
      setTimeout(() => {
        this.pushNotificationService.requestPermission();
      }, 3000);
    }
    if ('Notification' in window) {
      this.notificationsPermission = Notification.permission;
    }
    /**
     * Set state variables from user's settings.
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.currentPlan = user.settings.plan_type || PlanType.FREE;
        this.EMAIL_LIMIT = this.userState.settings.emails_per_page ? this.userState.settings.emails_per_page : 20;
        this.customFolders = user.customFolders;
        if (this.breakpointsService.isSM() || this.breakpointsService.isXS()) {
          this.LIMIT = this.customFolders.length;
        }
        this.handleCustomCss(user.settings.custom_css);
        if (user.settings) {
          setTimeout(() => {
            this.isloading = false;
          }, 1000);
        }
      });

    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailboxes: MailBoxesState) => {
        this.currentMailbox = mailboxes.currentMailbox;
      });

    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
        this.starredCount = this.mailState.starredFolderCount ? this.mailState.starredFolderCount : 0;
        this.currentFolder = mailState.currentFolder;
        this.updateTitle();
      });
    /**
     * Update Title on contacts or settings page
     */
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        if (event.url === '/mail/contacts') {
          this.updateTitle(`${this.capitalize(event.url.split('/mail/')[1])} - CTemplar: Armored Email`);
        } else if (event.url.includes('/mail/settings/')) {
          this.updateTitle(`Settings - CTemplar: Armored Email`);
        }
      });

    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((parameters: Params) => {
      this.forceLightMode = parameters.lightMode;
      if (this.forceLightMode) {
        this.themeToggleService.forceLightModeTheme();
      }
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  private updateUnreadCount(webSocketState: WebSocketState) {
    this.store.dispatch(
      new GetUnreadMailsCountSuccess({ ...webSocketState.message.unread_count, updateUnreadCount: true }),
    );
  }

  updateTitle(title: string = null) {
    // Set tab title
    if (!title) {
      title = `${this.mailState.currentFolder ? this.capitalize(this.mailState.currentFolder) : ''} `;
      if (
        this.mailState.currentFolder &&
        this.mailState.unreadMailsCount[this.mailState.currentFolder] &&
        (this.mailState.currentFolder === 'inbox' ||
          this.customFolders.some(folder => this.mailState.currentFolder === folder.name))
      ) {
        title += `(${this.mailState.unreadMailsCount[this.mailState.currentFolder]}) - `;
      } else if (this.mailState.currentFolder) {
        title += ' - ';
      }
      title += 'CTemplar: Armored Email';
    }
    this.titleService.setTitle(title);
  }

  capitalize(s: string) {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  handleCustomCss(customCss: string) {
    document.querySelector('#ctemplar-custom-css').innerHTML = customCss;
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

  // Toggle between display entire custom folders or limited count of folders
  toggleDisplayLimit(totalItems: number) {
    if (this.LIMIT === totalItems) {
      this.LIMIT = 3;
    } else {
      this.LIMIT = totalItems;
    }
  }

  // Toggle menu according to screen size
  toggleMenu(event?: any) {
    if (this.breakpointsService.isXS()) {
      if (this.isMenuOpened) {
        this.document.body.classList.remove('menu-open');
        this.isMenuOpened = false;
      }
      if (this.document.body.classList.contains('menu-open')) {
        this.isMenuOpened = true;
      }
    } else if (this.breakpointsService.isMD()) {
      if (event) {
        this.isSidebarOpened = false;
      } else {
        this.isSidebarOpened = !this.isSidebarOpened;
      }
    }
  }

  changeAsideExpand(event: any) {
    if (this.breakpointsService.isSM()) {
      this.isSidebarOpened = event.type === 'mouseover' ? true : false;
    }
  }

  showNotification(mail: Mail, folder: string) {
    const title = mail.sender_display_name ? mail.sender_display_name : mail.sender_display.name;
    const options = new PushNotificationOptions();
    options.body = 'You have received a new email';
    options.icon = 'https://mail.ctemplar.com/assets/images/media-kit/mediakit-logo4.png';

    this.pushNotificationService.create(title, options).subscribe(
      (notif: any) => {
        if (notif.event.type === 'click') {
          notif.notification.close();
          window.open(`/mail/${folder}/page/1/message/${mail.id}`, '_blank');
        }
      },
      (error: any) => {
        this.store.dispatch(new SnackErrorPush({ message: 'Failed to send push notification.' }));
      },
    );
  }

  /**
   * @description
   */
  // == Open NgbModal
  editFolder(folder: Folder) {
    if (folder) {
      const options: any = {
        centered: true,
        windowClass: 'modal-sm mailbox-modal create-folder-modal',
      };
      const component = this.modalService.open(CreateFolderComponent, options).componentInstance;
      component.folder = folder;
      component.edit = true;
    }
  }

  showConfirmationModal(folder: Folder) {
    this.confirmModalRef = this.modalService.open(this.confirmationModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
    this.selectedFolderForRemove = folder;
  }

  deleteFolder() {
    this.store.dispatch(new DeleteFolder(this.selectedFolderForRemove));
    setTimeout(() => {
      this.confirmModalRef.dismiss();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.titleService.setTitle('CTemplar: Armored Email');
  }
}
