import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {bitcoinApiUrl} from '../../shared/config';

@Injectable()
export class BitcoinService {
  constructor(private http: HttpClient) {
  }

  getBitcoinServiceValue() {
    return this.http.get<any>(`${bitcoinApiUrl}getServiceBitcoinValue`);
  }

  getNewWalletAddress() {
    return this.http.get<any>(`${bitcoinApiUrl}createNewWallet`);
  }
  checkPendingBalance(data: any) {
    return this.http.post(`${bitcoinApiUrl}checkPendingBalance`, data);
  }
}
