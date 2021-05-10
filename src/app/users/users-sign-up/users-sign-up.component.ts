import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Storage, StorageData } from '../../store/models';
import { SharedService } from '../../store/services';
import { FinalLoading } from '../../store/actions';
import { PRIMARY_WEBSITE } from '../../shared/config';

@Component({
  selector: 'app-users-sign-up',
  templateUrl: './users-sign-up.component.html',
  styleUrls: ['./users-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersSignUpComponent implements OnDestroy, OnInit {
  public storageList: Storage[];

  public selectedStorage: Storage;

  public mainPayments: any[];

  public selectedPayment = 0;

  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially

  public primaryWebsite = PRIMARY_WEBSITE;

  constructor(private sharedService: SharedService, private store: Store<any>) {}

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    this.storageList = StorageData;
    this.selectedStorage = this.storageList[0];
    this.mainPayments = [
      {
        id: 'pay-monthly',
        title: 'Pay Monthly',
        checked: true,
        moMoney: 0,
        totalMoney: 0,
      },
      {
        id: 'pay-annullay',
        title: 'Pay Annually',
        checked: false,
        moMoney: 0,
        totalMoney: 0,
      },
    ];
    this.makePayments();
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  makePayments() {
    this.mainPayments[0].moMoney = this.selectedStorage.price;
    this.mainPayments[1].moMoney = (this.selectedStorage.price * 0.8).toFixed(1);
    this.mainPayments[1].totalMoney = (this.selectedStorage.price * 9.6).toFixed(1);
  }

  onChangePayment(index: number) {
    this.selectedPayment = index;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
