import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  userImage$: Observable<string>;

  constructor(private auth: AuthenticationService) {

    auth.getUser$().subscribe(user => {
      console.log('user: ', user);
    });


    this.loggedIn$ = auth.getUser$().map(x => x !== null);
    this.userImage$ = auth.getUser$().map(user => user ? user.photoURL : '');
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
  ngOnInit() {
  }

}
