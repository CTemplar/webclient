import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bitcoinApiUrl } from '../../shared/config';

@Injectable()
export class BitcoinService {
  constructor(private http: HttpClient) {
  }

  getBitcoinServiceValue(data: any) {
    return this.http.post<any>(`${bitcoinApiUrl}getServiceBitcoinValue`, data);
  }

  createNewWallet(data: any) {
    return this.http.post<any>(`${bitcoinApiUrl}createNewWallet`, data);
  }

  checkTransaction(data: any) {
    return this.http.post(`${bitcoinApiUrl}checkTransaction`, data);
  }
}
