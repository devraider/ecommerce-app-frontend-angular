import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.scss']
})
export class CartStatusComponent implements OnInit {

  totalPrice!: Observable<number>;
  totalQantity!: Observable<number>;

  constructor(private _cartService: CartService){}
  ngOnInit() {
    this.totalPrice = this._cartService.totalPrice.asObservable();
    this.totalQantity = this._cartService.totalQuantity.asObservable();
  }
}
