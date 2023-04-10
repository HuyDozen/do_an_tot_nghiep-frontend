import { Component,OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import {} from '@fortawesome/free-regular-svg-icons'
import {faPlus, faDashboard} from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  faDashboard = faDashboard;
  faPlus = faPlus;
  cartData: CartModelServer;
  cartTotal:number;
  subTotal:number;

  constructor(public cartService: CartService){
  }
  ngOnInit():void {
    this.cartService.cartData$.subscribe({
      next: (data:CartModelServer) => {
        this.cartData = data;
      }
    });
    this.cartService.cartTotal$.subscribe({
      next:(total) =>{
        this.cartTotal = total
      }
    });
  }
  
  ChangeQuantity(index: number, increase:boolean){
    this.cartService.UpdateCartItems(index,increase)
  }
}
