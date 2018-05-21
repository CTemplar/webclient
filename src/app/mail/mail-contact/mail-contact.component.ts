import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../../store/datatypes';
import { selectUsersState } from '../../store/selectors';
import { Contact } from '../../store';
// Store
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit {
  // tslint:disable-next-line:indent
  isLayoutSplitted: boolean = false;
  public getUsersState$: Observable<any>;
  public userState: UserState;

  constructor(private store: Store<UserState>) {}

  ngOnInit() {
    this.getUsersState$ = this.store.select(selectUsersState);

    this.store.dispatch(new Contact({}));
    this.updateUsersStatus();
  }

  initSplitContactLayout(): any {
    this.isLayoutSplitted = true;
  }

  destroySplitContactLayout(): any {
    this.isLayoutSplitted = false;
  }

  private updateUsersStatus(): void {
    this.getUsersState$.subscribe((state: UserState) => {
      this.userState = state;
    });
  }
}
