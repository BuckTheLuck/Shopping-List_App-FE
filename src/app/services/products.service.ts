import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsData } from '../models/product-data';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsUrl = 'assets/products.json';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<{ products: ProductsData[] }> {
    return this.http.get<{ products: ProductsData[] }>(this.productsUrl);
  }
}
