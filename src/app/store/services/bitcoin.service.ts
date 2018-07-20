import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {bitcoinUrl} from '../../shared/config';

@Injectable()
export class BitcoinService {
  constructor(private http: HttpClient) {
  }

  getBitcoinServiceValue() {
    return this.http.get<any>(`${bitcoinUrl}api/v1.0/bitcoin/getServiceBitcoinValue`);
  }

  getNewWalletAddress() {
    return this.http.get<any>(`${bitcoinUrl}api/v1.0/bitcoin/createNewWallet`);
  }
  checkPendingBalance(data: any) {
    return this.http.post(`${bitcoinUrl}api/v1.0/bitcoin/checkPendingBalance`, data);
  }
}
