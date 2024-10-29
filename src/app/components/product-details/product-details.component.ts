import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{

  product!: Product;

  constructor(private _route: ActivatedRoute, private _productService: ProductService, private _cart: CartService) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }


  handleProductDetails() {
    // get id param string and convert it to a number 
    const paramId: number = + this._route.snapshot.paramMap.get("id")!;


    this._productService.getProduct(paramId).subscribe(data => {
      this.product = data;
    });
  }

  addToCart(product: Product) {
    const newCartItem = new CartItem(product);
    this._cart.addToCart(newCartItem);
  }
 
}
