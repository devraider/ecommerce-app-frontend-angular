import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    const userEmail = JSON.parse(this.storage.getItem("userEmail")!);
    this.orderHistoryService.getOrderHistory(userEmail).subscribe(
      data => this.orderHistory = data._embedded.orders
    )
  }
}
