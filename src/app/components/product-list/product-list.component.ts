import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchMode: boolean = false;

  currentCategoryId: number = 1;
  pageNumber = 1;
  pageSize = 10;
  totalElemets = 0;
  previousCategoryId: number = 1;


  previousKeyword: string = ""; 
  constructor( private _productService: ProductService, private route: ActivatedRoute, private _cartService: CartService){}


  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    })
  }


  listProduct() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    // check if id param it's available
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // if no category available set default to 1
      this.currentCategoryId = 1;
    }
    

    // check if we have different category than previous
    // if component it's in use then angular will use it instead of creating a new one



    //if we have different cateogry
    //then set pageNumber to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;


    this._productService.getProductListPaginate(this.pageNumber-1, this.pageSize, this.currentCategoryId).subscribe(
      this.processResult()
    );
  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get("keyword")!;
    // if we have different keyword than previous then set page to 1

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    // search for products
    this._productService.searchProductsPaginate(this.pageNumber-1, this.pageSize, keyword).subscribe(
      this.processResult()
    );
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElemets = data.page.totalElements;
    }
  }
  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }

  addToCart(product: Product) {
    const newCartItem = new CartItem(product);

    this._cartService.addToCart(newCartItem);
  }
}
