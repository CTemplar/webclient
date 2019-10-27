import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState, AuthState, MailBoxesState, MailState, PlanType, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { DOCUMENT } from '@angular/common';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { NotificationService } from '../../store/services/notification.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PushNotificationService, PushNotificationOptions } from '../../shared/services/push-notification.service';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {

  LIMIT = 3;
  EMAIL_LIMIT = 20;
  PAGE = 1;
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
  currentPlan: PlanType;

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
              @Inject(DOCUMENT) private document: Document) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
    const nextPage = localStorage.getItem('nextPage');
    if (nextPage) {
      localStorage.setItem('nextPage', '');
      this.router.navigateByUrl(nextPage);
    }

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
              { outbox: webSocketState.message.unread_count.outbox, updateUnreadCount: true, }));
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
      });

    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailboxes: MailBoxesState) => {
        this.currentMailbox = mailboxes.currentMailbox;
      });

    this.store.select(state => state.mail).pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
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

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 5 folders per account
   */
  // == Open NgbModal
  open() {
    if (this.userState.isPrime) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else if (this.userState.customFolders === null || this.userState.customFolders.length < 5) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 5 folders.');
    }
  }

  // == Show mail compose modal
  openComposeMailDialog() {
    this.composeMailService.openComposeMailDialog();
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
    options.icon = 'https://ctemplar.com/assets/images/media-kit/mediakit-logo4.png';

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
