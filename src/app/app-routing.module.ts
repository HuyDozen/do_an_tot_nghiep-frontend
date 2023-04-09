import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileGuard } from './guard/profile.guard';
import { DoneComponent } from './components/done/done.component';

const routes: Routes = [
  {
    //Mot dg dan mac dinh va tro den homecomponent
    path: '', component: HomeComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component:CheckoutComponent
  },
  {
    path: 'done' ,component: DoneComponent
  },
  {
    path: 'login' ,component: LoginComponent
  },
  {
    path: 'profile',component: ProfileComponent,canActivate:[ProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
