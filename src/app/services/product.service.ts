import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { ProductModelServer,ServerResponse } from '../models/product.model';
import { enviroment } from 'src/enviroments/enviroment';


//dependence injection
@Injectable({
  providedIn: 'root' //cung cap truic tiep vao trong root
})
export class ProductService {

  private SERVER_URL = enviroment.SERVER_URL;
  //Dua vao 2 service vao http client
  constructor(private http: HttpClient) {}

  //Lay toan bo products tu backend server
  // getAllProducts(numberOfResults : number = 10){
  //   // return this.http.get<Config>(this.SERVER_URL + '/products' + numberOfResults); 
  //   // return this.http.get(url: this.SERVER_URL + '/products');
  //   return this.http.get( this.SERVER_URL + 'Products');
  // }

  getAllProducts(numberOfResults : number = 10) : Observable<ServerResponse>{
    // return this.http.get<Config>(this.SERVER_URL + '/products' + numberOfResults); 
    // return this.http.get(url: this.SERVER_URL + '/products');
    return this.http.get<ServerResponse>(this.SERVER_URL + 'api/Products/Products/SeachPr?page=1')
  }

  //Lay mot san pham tu server
  getSingleProduct(id: number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL + 'api/Products/' + id)
  }

  //Lay mot san pham tu mot category
  getProductsFromCategory(catName : string): Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + 'api/Products/category/' + catName)
  }
}
