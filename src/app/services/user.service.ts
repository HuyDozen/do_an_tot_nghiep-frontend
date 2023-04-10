import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { enviroment } from 'src/enviroments/enviroment';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth: boolean = false;
  private SERVER_URL = enviroment.SERVER_URL;
  
  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth)
  userData$: BehaviorSubject<SocialUser|ResponseModel> = new BehaviorSubject<SocialUser | ResponseModel>(null)
  loginMessage$ = new BehaviorSubject<string>(null);
  userRole: number;

  constructor(private socialAuthService: SocialAuthService,
    private httpClient:HttpClient) {

      socialAuthService.authState.subscribe({
        next: (user:SocialUser) => {
          if(user !=null){
            this.auth = true;
            this.authState$.next(this.auth);
            this.userData$.next(user);
          }
        }
      });
   }
   //Login user with email vs password
   loginUser(userName:string,password:string){
    
    
    let ha = this.httpClient.post<ResponseModel>(`${this.SERVER_URL}api/Users/login-user`,{userName,password})
    .pipe(catchError((err: HttpErrorResponse) => of(err.error.message)))
    .subscribe({
      next :(data : ResponseModel ) => {
        if (typeof (data) == 'string') {
          console.log(1);
          
          this.loginMessage$.next(data);
        } else {
          console.log(2);
          console.log(ha);
          this.auth = data.auth;
          this.userRole = data.role;
          this.authState$.next(this.auth);
          this.userData$.next(data);
      }
    }
    })
   }
   //Google Authentication
   googleLogin():any{
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
   }
   logout(){
    this.socialAuthService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
   }
}

export interface ResponseModel{
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
}
