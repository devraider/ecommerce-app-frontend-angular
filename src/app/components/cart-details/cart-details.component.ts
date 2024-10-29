import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice!: Observable<number>;
  totalQuantity!: Observable<number>;

  constructor(private _cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get handle to cart items
    this.cartItems = this._cartService.cartItems;
    // get total price
    this.totalPrice = this._cartService.totalPrice;
    
    // get total qty
    this.totalQuantity = this._cartService.totalQuantity;

    // copute total price and qty
    this._cartService.computeCartTotal()
  }


  incrementQty(cartItem: CartItem) {
    this._cartService.addToCart(cartItem);
  }

  decrementQty(cartItem: CartItem) {
    this._cartService.decrementQuanity(cartItem);
  }

  removeProduct(cartItem: CartItem) {
    this._cartService.remove(cartItem);
  }
}
