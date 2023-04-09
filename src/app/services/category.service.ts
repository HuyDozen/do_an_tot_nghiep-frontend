import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { ProductModelServer,ServerResponse } from '../models/product.model';
import { enviroment } from 'src/enviroments/enviroment';

//dependence injection
@Injectable({
    providedIn: 'root' //cung cap truic tiep vao trong root
  })
  export class CategoryService {
  
    private SERVER_URL = enviroment.SERVER_URL;
    //Dua vao 2 service vao http client
    constructor(private http: HttpClient) {}

    getAllCategories(numberOfResults : number = 10) : Observable<ServerResponse>{
      // return this.http.get<Config>(this.SERVER_URL + '/products' + numberOfResults); 
      // return this.http.get(url: this.SERVER_URL + '/products');
      return this.http.get<ServerResponse>(this.SERVER_URL + 'api/Categories')
    }
}