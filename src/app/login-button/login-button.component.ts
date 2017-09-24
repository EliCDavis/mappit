import { SelectTopoComponent } from '../select-topo/select-topo.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {

  loggedIn$: Observable<boolean>;
  userImage$: Observable<string>;

  constructor(private auth: AuthenticationService, private dialog: MdDialog) {
    this.loggedIn$ = auth.getUser$().map(x => x !== null);
    this.userImage$ = auth.getUser$().map(user => user ? user.photoURL : '');
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

  changeSub() {
    this.dialog.open(SelectTopoComponent);
  }

  ngOnInit() {
  }

}
