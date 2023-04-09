import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { enviroment } from 'src/enviroments/enviroment';
import {CartModelPublic,CartModelServer} from '../models/cart.model'
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import {ProductModelServer} from '../models/product.model'
// import { JsonPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { state } from '@angular/animations';

// Sd cai tren thay vi tu generate ra 1 trong 2 cai duoi
// import { ToastrService } from 'ngx-toastr/public_api';
// import { ToastrService } from 'ngx-toastr/toastr/toastr.service';


@Injectable({
    providedIn:'root'
})

export class CartService{
    private SERVER_URL = enviroment.SERVER_URL;


    //Du lieu variable de luu tru cart infor on the client's local storage 
    private cartDataClient : CartModelPublic = {
        total : 0,
        prodData: [{
            incart: 0,
            id: 0
        }]
    };

    //Du lieu luu tru thong tin cart on the server
    private cartDataServer : CartModelServer = {
        total: 0,
        data:[{
            numInCart: 0,
            product: undefined
        }]
    };
    
    // Muc dich de khi resert cho trang web ko lam mat di gio do cua mih
    // Nhung muc do se dc tham chieu trong local storage
    // Observable cho các components để subscribe
    cartTotal$ = new BehaviorSubject<number>(0);
    cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

    constructor(private http:HttpClient,
        private producService: ProductService,
        private orderService:OrderService,
        private toast:ToastrService,
        private spinner:NgxSpinnerService,
        private router: Router){
            
            this.cartTotal$.next(this.cartDataServer.total);
            this.cartData$.next(this.cartDataServer);
            
            // Lay thong tin tu local storage (if any)
            let info : CartModelPublic  = JSON.parse(localStorage.getItem('cart'));
         

            // Kiem tra info variable co null hoac co mot vai data trong do
            if (info != null && info != undefined && info.prodData[0].incart != 0 ){
                // Local storage ko emptyva co mot vai infomations
                this.cartDataClient = info;

                // Lap qua mot vai entry and dat no vao trong cartDataService object
                this.cartDataClient.prodData.forEach(
                    p => {
                        this.producService.getSingleProduct(p.id).subscribe({
                            next : (actualProductINfo : ProductModelServer ) =>{
                                if(this.cartDataServer.data[0].numInCart == 0){
                                    // Du lieu tra ve tu serve la trong
                                    this.cartDataServer.data[0].numInCart = p.incart;
                                    this.cartDataServer.data[0].product = actualProductINfo;

                                    // Todo tao mot calculateTotal Function de thay the no o day
                                    this.calculateTotal();
                                    this.cartDataClient.total = this.cartDataServer.total;
                                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                                }  else {
                                    // cartDataServer co mot vai entry trong no
                                    this.cartDataServer.data.push({
                                        numInCart: p.incart,
                                        product: actualProductINfo
                                    });
                                   // Todo tao mot calculateTotal Function de thay the no o day
                                   this.calculateTotal();
                                   this.cartDataClient.total = this.cartDataServer.total;
                                   localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                                }
                                this.cartData$.next( {... this.cartDataServer});
                            }
                        })
                    }
                )
            }
        }

        AddProductToCart(id: number, quantity?: number){
            this.producService.getSingleProduct(id).subscribe(prod => {
                // 1.If the cart is empty
                if(this.cartDataServer.data[0].product == undefined){
                    this.cartDataServer.data[0].product = prod;
                    this.cartDataServer.data[0].numInCart = quantity != undefined ? quantity : 1;
                    //CALCULATE TOTAL AMOUNT
                    this.calculateTotal();
                    this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
                    this.cartDataClient.prodData[0].id = prod.id;

                    this.cartDataClient.total = this.cartDataServer.total;
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    this.cartData$.next({... this.cartDataServer});

                    //display a TOAST NOTIFICATION  
                    this.toast.success(`${prod.title} đã được thêm vào cart`,"Sản phẩm đã được thêm",{
                        timeOut: 1500,
                        progressBar:true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-full-width'
                    })              
                }
                // 2.If the cart has some items
                else {
                    let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id);

                        // a. Neu item do co san trong cart => index la positive value
                        if (index != -1){
                            if (quantity != undefined && quantity <= prod.quanity){
                                this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quanity ? quantity : prod.quanity;

                            }
                            else{
                                this.cartDataServer.data[index].numInCart < prod.quanity ? this.cartDataServer.data[index].numInCart++ : prod.quanity;
                            }

                            this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
                            //TODO CALCULATE TOTAL AMOUNT
                            this.calculateTotal();
                            this.cartDataClient.total = this.cartDataServer.total;
                            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                            //TODO DISPLAY TOAST MESSAGE
                            this.toast.info(`${prod.title} quantity updated in the cart.`, "Product Updated", {
                                timeOut: 1500,
                                progressBar: true,
                                progressAnimation: 'increasing',
                                positionClass: 'toast-bottom-right'
                              })                         
                      } //End of else
                        // b. Neu item do ko co trong cart
                        else{
                            this.cartDataServer.data.push({
                                numInCart: 1,
                                product: prod
                            });

                            this.cartDataClient.prodData.push({
                                incart: 1,
                                id: prod.id
                            });  
                            this.toast.success(`${prod.title} added to the cart.`, "Product Added", {
                                timeOut: 1500,
                                progressBar: true,
                                progressAnimation: 'increasing',
                                positionClass: 'toast-bottom-right'
                              })
                            //TODO CALCULATE TOTAL AMOUNT
                            this.calculateTotal();
                            this.cartDataClient.total = this.cartDataServer.total;                         
                            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                            this.cartData$.next({... this.cartDataServer});

                        } // End of else
                }                            
            });      
        }
        UpdateCartItems(index: number, increase: boolean){
            let data = this.cartDataServer.data[index];
            
            if (increase){
                data.numInCart < data.product.quanity ? data.numInCart++ : data.product.quanity;
                this.cartDataClient.prodData[index].incart = data.numInCart;
                //TODO CALCULATE TOTAL AMOUNT
                this.calculateTotal();
                 
                 
                this.cartDataClient.total = this.cartDataServer.total;
              
                this.cartData$.next({... this.cartDataServer});
                localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
               
            }else{
                data.numInCart--;
                if(data.numInCart < 1){
                    //TODO DELETE THE PRODUCT FROM CART
                    this.DeleteProductFromCart(index);
                    this.cartData$.next({... this.cartDataServer});
                }else{
                    this.cartData$.next({... this.cartDataServer});
                    this.cartDataClient.prodData[index].incart = data.numInCart;

                    //CALCULATE TOTAL AMOUNT
                    this.calculateTotal();
                    this.cartDataClient.total = this.cartDataServer.total;
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                }
            }
        }

        DeleteProductFromCart(index:number){
            if(window.confirm('Bạn có chắc muốn xoá món hàng này?'))
            {
                this.cartDataServer.data.splice(index, 1);
                this.cartDataClient.prodData.splice(index, 1);
                //TODO CALCULATE TOTAL AMOUNT
                this.calculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;

                if(this.cartDataClient.total == 0){
                    this.cartDataClient = {
                        total: 0,
                        prodData:[{
                            incart:0,
                            id: 0
                        }]
                    };
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                }else{
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                }
                if(this.cartDataServer.total == 0){
                    this.cartDataServer = {total:0, data:[{numInCart:0,product: undefined}]};
                    this.cartData$.next({... this.cartDataServer});
                }else{
                    this.cartData$.next({... this.cartDataServer});
                }
            }else{
                // IF THE USER CLICK THE CANCEL BUTTON
                return;
            }
        }
        private calculateTotal(){
            let Total = 0;
            this.cartDataServer.data.forEach( p => {
                const {numInCart} = p;
                const {price} = p.product;

                Total += numInCart * price;
            })
            this.cartDataServer.total = Total;
            this.cartTotal$.next(this.cartDataServer.total);
        }
        
        checkoutFromCart(userId: number){
            this.http.post(`${this.SERVER_URL}payment`, null).subscribe({next : (res : {}) =>{    
                if(res) {
                    this.resertServerData();
                    console.log(1);
                    this.http.post(`${this.SERVER_URL}new-order`, {
                        userId,
                        products: this.cartDataClient.prodData
                    }).subscribe({
                        next : (data:OrderResponse | any) => {
                                this.orderService.getSingleOrder(data.orderId).then(prods => {                                   
                            if(data){
                                const navigationExtras: NavigationExtras = {
                                    state:{
                                        message: data.message,
                                        products: prods,
                                        orderId : data.orderId,
                                        total: this.cartDataClient.total
                                    } 
                                };
                                //HIDE SPINNER
                                this.spinner.hide().then();

                                this.router.navigate(['done'],navigationExtras).then(p => {
                                    this.cartDataClient = {total:0,prodData:[{incart:0,id:0}]};
                                    this.cartData$.next({... this.cartDataServer});
                                    localStorage.setItem('cart',JSON.stringify(this.cartDataClient))
                                });
                            }
                        }); 
                   
                        }
                    }) 
                    // => { //Can fix lai

                    
                }else{  
                    this.spinner.hide().then();
                    this.router.navigateByUrl('checkout').then();
                    this.toast.error(`Sorry guy, failed to book the store`,`Order status`,{
                        timeOut: 1500,
                        progressBar:true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right'
                    })    

                }   
            }})          
        }
        private resertServerData(){
            this.cartDataServer =  {
                total:0,
                data:[{
                    numInCart: 0,
                    product:undefined 
                }]
            };
            this.cartData$.next({... this.cartDataServer});
        }
        CalculateSubTotal(index: number) {
            let subTotal = 0;
        
            let p = this.cartDataServer.data[index];
            // @ts-ignore
            subTotal = p.product.price * p.numInCart;
        
            return subTotal;
          }
}

export interface OrderResponse{
    orderId: number;
    success: boolean;
    message: string;
    products: [{
    id: string,
    numInCart: string
    }]
}