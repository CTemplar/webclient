// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';

// Model
import { Storage } from '../../models/users';
import { SharedService } from '../../shared/shared.service';

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

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);

    this.storageList = [
      {type: '5 Gb Storage', money: 2},
      {type: '10 Gb Storage', money: 4},
      {type: '15 Gb Storage', money: 8},
      {type: '20 Gb Storage', money: 12},
      {type: '25 Gb Storage', money: 16}
    ];
    this.selectedStorage = this.storageList[0];
    this.mainPayments = [
      {id: 'pay-monthly', title: 'Pay Monthly', checked: true, moMoney: 0, totalMoney: 0},
      {id: 'pay-annullay', title: 'Pay Annually', checked: false, moMoney: 0, totalMoney: 0}
    ];
    this.makePayments();
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }

  onChangeType(item) {
    this.selectedStorage = item;
    this.makePayments();
  }

  makePayments() {
    this.mainPayments[0].moMoney = this.selectedStorage.money;
    this.mainPayments[1].moMoney = (this.selectedStorage.money * 0.8).toFixed(1);
    this.mainPayments[1].totalMoney = (this.selectedStorage.money * 9.6).toFixed(1);
  }

  onChangePayment(index) {
    this.selectedPayment = index;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
