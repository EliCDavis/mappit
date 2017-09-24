import { User } from '../user';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Topology } from './topology';
import { Post } from '../post';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class TopologyService {

  lastTopoSnapshot: firebase.database.DataSnapshot;

  topoUpdates$: ReplaySubject<firebase.database.DataSnapshot>;

  createPostRequest$: Subject<{ topo: string, title: string, content: string, mapData: any }>;

  createTopoRequest$: Subject<{ title: string, description: string }>;

  subscribeToTopoRequest$: Subject<string>;
  unsubscribeToTopoRequest$: Subject<string>;

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) {

    this.subscribeToTopoRequest$ = new Subject<string>();
    this.subscribeToTopoRequest$
      .withLatestFrom(this.auth.getUser$(), (topo, user) => {
        if (user === null) {
          return null;
        }
        return { uid: user.uid, topo: topo }
      })
      .filter(x => x !== null)
      .subscribe(x => {
        this.db.database.ref(`users/${x.uid}/subscriptions`).update({ [x.topo]: x.topo });
      });

    this.unsubscribeToTopoRequest$ = new Subject<string>();
    this.unsubscribeToTopoRequest$
      .withLatestFrom(this.auth.getUser$(), (topo, user) => {
        console.log(topo, user);
        if (user === null) {
          return null;
        }
        return { uid: user.uid, topo: topo }
      })
      .filter(x => x !== null)
      .subscribe(x => {
        this.db.database.ref(`users/${x.uid}/subscriptions/${x.topo}`).remove();
      });

    // Watch all updates
    this.topoUpdates$ = new ReplaySubject<any>(1);
    db.database.ref('topologys').on('value', (x) => {
      this.lastTopoSnapshot = x;
      this.topoUpdates$.next(x)
    });

    this.createTopoRequest$ = new Subject<{ title: string, description: string }>();
    this.createTopoRequest$
      .withLatestFrom(this.auth.getUser$(), (a, b) => {
        if (b == null) {
          return;
        }
        return {
          name: a.title,
          details: {
            date: Date.now(),
            owner: b.uid,
            ownerName: b.displayName,
            ownerPic: b.photoURL,
            description: a.description,
            subscribers: { [b.uid]: b.displayName },
            posts: {}
          }
        }
      })
      .filter(u => u !== null)
      .subscribe(x => {
        this.db.database.ref(`topologys/${x.name}`).set(x.details)
      });

    this.createPostRequest$ = new Subject<{ topo: string, title: string, content: string, mapData: any }>();
    this.createPostRequest$
      .withLatestFrom(this.auth.getUser$(), (a, b) => {
        if (b == null) {
          return;
        }
        return {
          comments: {},
          date: Date.now(),
          uid: b.uid,
          user: b.displayName,
          picUrl: b.photoURL,
          ...a
        }
      })
      .filter(u => u !== null)
      .subscribe(x => {
        console.log('req', x)
        this.db.database.ref(`topologys/${x.topo}/posts`).push(x)
      });
  }

  createPost(topo: string, title: string, content: string, mapData: any) {
    this.createPostRequest$.next({
      title: title,
      content: content,
      mapData: mapData,
      topo: topo
    });
    return null;
  }

  subscribeToTopo(topo) {
    if (topo === null) {
      return;
    }
    this.subscribeToTopoRequest$.next(topo);
  }

  unSubscribeToTopo(topo) {
    if (topo === null) {
      return;
    }
    this.unsubscribeToTopoRequest$.next(topo);
  }

  createTopography(title: string, description: string): string {
    if (this.lastTopoSnapshot.child(title).exists()) {
      return 'This topography already exists!';
    }
    this.createTopoRequest$.next({
      title: title, description: description
    });
    return null;
  }

  getTopology$(): Observable<firebase.database.DataSnapshot> {
    return this.topoUpdates$
  }

}
