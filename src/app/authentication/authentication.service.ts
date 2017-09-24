import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthenticationService {

  private user$: ReplaySubject<any>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user$ = new ReplaySubject<any>(1);

    const allUsers = new Subject<any>();
    this.db.database.ref('users').on('value', (users) => allUsers.next(users.toJSON()))

    afAuth.authState
      .combineLatest(allUsers, (fbUser, restOfData) => {
        if (fbUser === null) {
          return null;
        }
        return restOfData && restOfData[fbUser.uid]? { ...fbUser, ...restOfData[fbUser.uid] } : fbUser;
      })
      .subscribe(x => {
        this.user$.next(x)
      });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  getUser$(): ReplaySubject<any> {
    return this.user$;
  }

}
