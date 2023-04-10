import {Component, OnInit} from '@angular/core';
import {ResponseModel, UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser: any;


  constructor(private authService: SocialAuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | ResponseModel) => {
          if (user instanceof SocialUser) {
            return {
              email: 'test@test.com',
              ...user

            };
          } else {
            return user;
          }
        })
      )
      .subscribe({
        next : (data: ResponseModel | SocialUser) => {
          this.myUser = data;
        }
      });
  }

  logout() {
    this.userService.logout();
  }
}