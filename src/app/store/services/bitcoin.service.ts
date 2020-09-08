import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../shared/config';

@Injectable()
export class BitcoinService {
  constructor(private http: HttpClient) {}

  createNewWallet(data: any) {
    return this.http.post<any>(`${apiUrl}btc-wallet/create/`, data);
  }

  checkTransaction(data: any) {
    return this.http.get(
      `${apiUrl}btc-wallet/check/?address=${data.from_address}` +
        (data.promo_code ? `&promo_code=${data.promo_code}` : '')
    );
  }
}
