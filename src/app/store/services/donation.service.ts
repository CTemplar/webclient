import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiUrl } from '../../shared/config';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private http: HttpClient) {}

  /**
   * @description
   * Endpoint for accepting Stripe Donations
   *
   * @param data - stripe_token (required) | amount (required)
   */
  makeStripeDonation(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}donate/stripe/`, data);
  }
}
