import { Component, Inject, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState, AuthState, MailBoxesState, MailState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { Folder, Mailbox } from '../../store/models/mail.model';
import { DOCUMENT } from '@angular/common';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { NotificationService } from '../../store/services/notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { GetMails, GetUnreadMailsCount } from '../../store/actions';
import { takeUntil } from 'rxjs/operators';
import { Message, WebsocketService } from '../../shared/services/websocket.service';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {

  LIMIT = 3;
  EMAIL_LIMIT = 20;

  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public userState: UserState;

  mailState: MailState;
  currentRoute: string;

  isMenuOpened: boolean;
  isSidebarOpened: boolean;
  customFolders: Folder[] = [];
  currentMailbox: Mailbox;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              config: NgbDropdownConfig,
              private breakpointsService: BreakpointsService,
              private composeMailService: ComposeMailService,
              private notificationService: NotificationService,
              private router: Router,
              private websocketService: WebsocketService,
              @Inject(DOCUMENT) private document: Document) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';

    this.router.events.pipe(takeUntil(this.destroyed$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });

    this.store.dispatch(new GetUnreadMailsCount());
    this.websocketService.connect();

    // listen to web sockets events of new emails from server.
    websocketService.messages.pipe(takeUntil(this.destroyed$))
      .subscribe((response: Message) => {
        this.store.dispatch(new GetUnreadMailsCount());
        this.store.dispatch(new GetMails({ limit: this.EMAIL_LIMIT, offset: 0, folder: response.folder, read: false, seconds: 300 }));
      });
    this.store.select(state => state.auth).pipe(takeUntil(this.destroyed$))
      .subscribe((authState: AuthState) => {
        if (!authState.isAuthenticated) {
          this.websocketService.disconnect();
        }
      });
  }

  ngOnInit() {
    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.EMAIL_LIMIT = this.userState.settings.emails_per_page ? this.userState.settings.emails_per_page : 20;
        this.customFolders = user.customFolders;
        if (this.breakpointsService.isSM() || this.breakpointsService.isXS()) {
          this.LIMIT = this.customFolders.length;
        }
      });

    this.store.select(state => state.mailboxes).pipe(takeUntil(this.destroyed$))
      .subscribe((mailboxes: MailBoxesState) => {
        this.currentMailbox = mailboxes.currentMailbox;
      });

    this.store.select(state => state.mail).pipe(takeUntil(this.destroyed$))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
      });
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  // == Open NgbModal
  open() {
    if (this.userState.isPrime) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else if (this.userState.customFolders === null || this.userState.customFolders.length < 3) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 3 folders.');
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


  ngOnDestroy(): void {
  }
}
