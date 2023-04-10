import {Component, OnInit} from '@angular/core';
import {faGoogle} from '@fortawesome/free-brands-svg-icons'
import {FormBuilder, FormGroup, NgForm,Validators} from '@angular/forms';
import { SocialUser  } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
// implements OnInit
export class LoginComponent  implements OnInit{
  faGoogle = faGoogle;
  
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean;

  email: string;
  password: string;
  loginMessage: string;
  userRole: number;

  constructor(private socialAuthService: SocialAuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userService.authState$.subscribe({
      next : (authState : boolean) => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');

      } else {
        this.router.navigateByUrl('/login');
      }
    }
    });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
    });
  }


  signInWithGoogle() {
    this.userService.googleLogin();
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return;
    }

    form.reset();
    
    
    this.userService.loginUser(email, password);

    this.userService.loginMessage$.subscribe({
      next : (msg) => {
        this.loginMessage = msg;
        setTimeout(() => {
          this.loginMessage = '';
        }, 2000);
      }
    }); 
  }
}
