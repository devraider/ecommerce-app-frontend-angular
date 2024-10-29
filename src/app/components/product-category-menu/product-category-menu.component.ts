import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.scss']
})
export class ProductCategoryMenuComponent  implements OnInit{
  productCategories!: ProductCategory[];

  constructor(private _productService: ProductService) {}


  ngOnInit() {
    this.listProductCatogories();
  }

  listProductCatogories() {
    this._productService.getProductCategories().subscribe(data => {
      console.log(data)
      this.productCategories = data;
    })
  }
}
