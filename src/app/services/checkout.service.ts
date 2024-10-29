import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.baseUrl;

  private purchaseUrl = `${this.baseUrl}/checkout/purchase`;


  constructor( private _httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this._httpClient.post<Purchase>(this.purchaseUrl, purchase)
  }

}
