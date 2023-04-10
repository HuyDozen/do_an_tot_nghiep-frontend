import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ProductService } from './product.service';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
    providedIn:'root'
})

export class OrderService{
    private products: ProductResponseModel[] = [];
    private SERVER_URL = enviroment.SERVER_URL;

    constructor(private http:HttpClient
        ){}
    
    getSingleOrder(orderId: number){
        return this.http.get<ProductResponseModel[]>(this.SERVER_URL + 'get/' + orderId).toPromise()
    }
}

interface ProductResponseModel {
    id:number;
    tittle:string;
    description:string;
    price:number;
    quantityOrdered:number;
    image:string;
}