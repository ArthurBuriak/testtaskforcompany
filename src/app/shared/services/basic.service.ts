import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interface/product';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  jsonUrl = "http://localhost:3000/posts";

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(this.jsonUrl);
  }

  postProducts(newPost: Product): Observable<Product>{
    return this.http.post<Product>(this.jsonUrl, newPost);
  }

  delteProduct(id: number | undefined): Observable<Product>{
    return this.http.delete<Product>(this.jsonUrl + "/" + id);
  }

  getProductById(id: number | undefined): Observable<Product[]>{
    return this.http.get<Product[]>(this.jsonUrl + "/" + id);
  }

  updateProduct(id: number | undefined, newData: Product): Observable<Product>{
    return this.http.put<Product>(this.jsonUrl + "/" + id, newData);
  }

}
