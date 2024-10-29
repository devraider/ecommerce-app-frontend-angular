import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  baseUrl = environment.baseUrl;

  private orderUrl = `${this.baseUrl}/orders`;
  constructor(private _http: HttpClient) { }


  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    return this._http.get<GetResponseOrderHistory>(`${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`)
  }

}


interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}