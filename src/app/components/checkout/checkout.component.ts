import { Component,OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import {Router} from '@angular/router'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  cartTotal: number;
  cartData: CartModelServer
  userId = 2;

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService
    ){}
  
    ngOnInit(): void {
      this.cartService.cartData$.subscribe(data => this.cartData = data);
      this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
      this.userService.userData$.subscribe({
        next : (data) => {
        // @ts-ignore
        this.userId = data.userId || data.id;
        }
      });
  
    }
  onCheckout() {
    if (this.cartTotal > 0) {
      this.spinner.show().then(p => {
        this.cartService.checkoutFromCart(2);
     
        
      });
    } else {
      return;
    }


  }
}
