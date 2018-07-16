// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
// Model
import { Storage, StorageData } from '../../store/models';
import { SharedService } from '../../store/services';

import { FinalLoading } from '../../store/actions';
import { Store } from '@ngrx/store';
import { DynamicScriptLoaderService } from '../../shared/services/dynamic-script-loader.service';

@Component({
  selector: 'app-users-sign-up',
  templateUrl: './users-sign-up.component.html',
  styleUrls: ['./users-sign-up.component.scss']
})
export class UsersSignUpComponent implements OnDestroy, OnInit {
  public storageList: Storage[];
  public selectedStorage: Storage;
  public mainPayments: any[];
  public selectedPayment = 0;
  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially
  constructor(
    private sharedService: SharedService,
    private store: Store<any>,
    private dynamicScriptLoader: DynamicScriptLoaderService
  ) {}

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
        totalMoney: 0
      },
      {
        id: 'pay-annullay',
        title: 'Pay Annually',
        checked: false,
        moMoney: 0,
        totalMoney: 0
      }
    ];
    this.makePayments();
    this.loadStripeScripts();
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  onChangeType(item) {
    this.selectedStorage = item;
    this.makePayments();
  }

  makePayments() {
    this.mainPayments[0].moMoney = this.selectedStorage.price;
    this.mainPayments[1].moMoney = (this.selectedStorage.price * 0.8).toFixed(
      1
    );
    this.mainPayments[1].totalMoney = (
      this.selectedStorage.price * 9.6
    ).toFixed(1);
  }

  onChangePayment(index) {
    this.selectedPayment = index;
  }

  private loadStripeScripts() {
    this.dynamicScriptLoader.load('stripe', 'stripe-key').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
