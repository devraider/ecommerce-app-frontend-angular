import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent {


  constructor(private _router: Router) {}

  productSearch(searchKeyword: string) {
    this._router.navigateByUrl(`/search/${searchKeyword.trim()}`);
  }
}
