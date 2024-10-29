import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() { 

    // read data from storage
    let item = this.storage.getItem('cartItems');
    let data;

    if (item !== null) {
      data = JSON.parse(item);
      this.cartItems = data;
      this.computeCartTotal();
    }

  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(cartItem: CartItem) {
    // check if we have items in our cart
    let alreadyExist = false;
    let existingCartItem = undefined;

    // find item in the cart by id
    existingCartItem = this.cartItems.find(data => data.id === cartItem.id);
    
    //check if we find given item
    alreadyExist = (existingCartItem != undefined);

    if(alreadyExist && existingCartItem) {
      // increment qty of item
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem)
    }

    // compute cart total price and total qty
    this.computeCartTotal();
  }

  decrementQuanity(cartItem: CartItem) {
    cartItem.quantity--;
    console.log(this.cartItems)
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotal();
    }
  }
  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(cItem => cItem.id === cartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotal();
    }
  }

  computeCartTotal() {
    let totalPriceValue = 0;
    let totalQtyValue = 0;

    for (let cItem of this.cartItems) {
      totalPriceValue += cItem.unitPrice * cItem.quantity;
      totalQtyValue += cItem.quantity;
    }

    // publish new values to subjects
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQtyValue);

    // persist data
    this.persistCartItems();
  }
}
