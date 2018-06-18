// Angular
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// Bootstrap
import {
  NgbModal,
  ModalDismissReasons,
  NgbDropdownConfig
} from "@ng-bootstrap/ng-bootstrap";

// Store
import { Store } from "@ngxs/store";

// import {
//   Myselfs,
//   WhiteList,
//   WhiteListAdd,
//   WhiteListDelete,
//   BlackListAdd,
//   BlackListDelete,
//   BlackList
// } from '../../store/actions';

// Rxjs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-settings",
  templateUrl: "./settings.component.pug",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially
  // public getUsersState$: Observable<any>;
  private whiteListForm: FormGroup;
  private blackListForm: FormGroup;
  private showFormErrors: boolean = false;

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store,
    private formBuilder: FormBuilder
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  }

  ngOnInit() {
    // this.store.dispatch(new Myselfs({}));
    // setTimeout(() => this.store.dispatch(new WhiteList({})));
    // setTimeout(() => this.store.dispatch(new BlackList({})));

    // this.updateUsersStatus();

    this.whiteListForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.email]]
    });
    this.blackListForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.email]]
    });
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector(".package-xs-tab > li").classList.remove("active");
    document
      .querySelector(".package-prime-col")
      .classList.remove("active-slide");
  }

  // == Methods related to ngbModal

  // == Open change password NgbModal
  changePasswordModalOpen(passwordContent) {
    this.modalService.open(passwordContent, {
      centered: true,
      windowClass: "modal-md"
    });
  }

  private updateUsersStatus(): void {
    // this.getUsersState$.subscribe((state: UserState) => {
    //   this.userState = state;
    // });
  }

  private addWhitelist(whiteList) {
    this.showFormErrors = true;
    if (this.whiteListForm.valid) {
      // this.store.dispatch(new WhiteListAdd(whiteList));
    }
  }

  private deleteWhiteList(id) {
    // this.store.dispatch(new WhiteListDelete(id));
    // this.updateUsersStatus();
  }

  private addBlacklist(blackList) {
    this.showFormErrors = true;
    if (this.blackListForm.valid) {
      // this.store.dispatch(new BlackListAdd(blackList));
    }
  }

  private deleteBlackList(id) {
    // this.store.dispatch(new BlackListDelete(id));
    // this.updateUsersStatus();
  }
}
