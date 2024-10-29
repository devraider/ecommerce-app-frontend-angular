import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = `${environment.baseUrl}/`;

   
  constructor(private http: HttpClient) { }


  getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}products/search/findByCategoryId?id=${categoryId}`
                      +`&page=${page}&size=${pageSize}`
    return this.http.get<GetResponseProducts>(searchUrl)
  }
  

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<GetResponseProducts>(searchUrl).pipe(
      map(reposnes => reposnes._embedded.products)
    );
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}products/${productId}`;

    return this.http.get<Product>(productUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const categoryUrl =   `${this.baseUrl}product-category`;
    return this.http.get<GetResponseProductCategory>(categoryUrl).pipe(
      map(data => data._embedded.productCategory)
    )
  }

  searchProducts(searchKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}products/search/findByNameContaining?name=${searchKeyword}`;
    return this.getProducts(searchUrl)
  }

  
  searchProductsPaginate(page: number, pageSize: number, searchKeyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}products/search/findByNameContaining?name=${searchKeyword}`+`&page=${page}&size=${pageSize}`
    return this.http.get<GetResponseProducts>(searchUrl)
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}



interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}