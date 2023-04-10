import { Component,OnInit } from '@angular/core';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {
  message: string;
  orderId: number;
  products: ProductResponseModel[] = [];
  cartTotal: number;
   constructor(private router: Router,
               private orderService: OrderService) {
     const navigation = this.router.getCurrentNavigation();
 
     const state = navigation.extras.state as {
       message: string,
       products: ProductResponseModel[],
       orderId: number,
       total: number
     };
     console.log(state);
     
 
     this.message = state.message;
     this.products = state.products;
     console.log(this.products);
     this.orderId = state.orderId;
     this.cartTotal = state.total;
 
 
 
   }
 
   ngOnInit(): void {
   }
 
 }
 
 interface ProductResponseModel {
   id: number;
   title: string;
   description: string;
   price: number;
   image: string;
   quantityOrdered: number;
 }
