import { AuthenticationService } from './authentication/authentication.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // All the sidenav logic because we gotta make it fluid -_-
  sidenavMode: Observable<string>;
  sidenavOpen$: Observable<boolean>;
  sidenavToggleClick$: Subject<any>;
  sidenavCloseRequest$: Subject<any>;

  loggedIn$: Observable<boolean>;
  userImage$: Observable<string>;

  constructor(private auth: AuthenticationService) {
    this.sidenavToggleClick$ = new Subject<any>();
    this.sidenavCloseRequest$ = new Subject<any>();
    auth.getUser$().subscribe(user => {
      console.log('user: ', user);
    });


    this.loggedIn$ = auth.getUser$().map(x => x !== null);
    this.userImage$ = auth.getUser$().map(user => user? user.photoURL : '');
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.sidenavMode = Observable.merge
      (
      Observable.fromEvent(window, 'resize')
        .map(() => {
          return document.documentElement.clientWidth;
        }),
      Observable.from([document.documentElement.clientWidth])
      )
      .map(x => x > 599 ? 'side' : 'over')
      .delay(100)
      .share();

    this.sidenavOpen$ = this.sidenavMode.combineLatest(
      this.sidenavToggleClick$
        .map(x => 'toggle')
        .merge(this.sidenavCloseRequest$.map(x => 'force'))
        .scan((acc, x) => x === 'force' ? false : !acc, false).startWith(false),
      (mode: string, toggle) => mode === 'side' ? true : toggle
    ).share();

  }

  

}