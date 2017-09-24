import { User } from '../user';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Topology } from './topology';
import { Post } from '../post';
import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class TopologyService {

  lastTopoSnapshot: firebase.database.DataSnapshot;

  topoUpdates$: Subject<firebase.database.DataSnapshot>;

  createPostRequest$: Subject<{ topo: string, title: string, content: string, mapData: any }>;

  createTopoRequest$: Subject<{ title: string, description: string }>;

  constructor(private db: AngularFireDatabase, private auth: AuthenticationService) {

    // Watch all updates
    this.topoUpdates$ = new Subject<any>();
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

  createTopography(title: string, description: string): string {
    if (this.lastTopoSnapshot.child(title).exists()) {
      return 'This topography already exists!';
    }
    this.createTopoRequest$.next({
      title: title, description: description
    });
    return null;
  }

  getTopology$(view: string): Observable<Topology> {
    return this.topoUpdates$.map(x => {
      const snapshot = x.child(view).toJSON() as any;

      // Make sure we're not trying to load a subreddit that doesn't exist
      if (snapshot === null) {
        return null;
      }

      // Build posts
      const posts = new Array<Post>();
      for (var property in snapshot.posts) {
        if (snapshot.posts.hasOwnProperty(property)) {
          posts.push(new Post(
            property,
            snapshot.posts[property].title,
            snapshot.posts[property].content,
            snapshot.posts[property].mapData,
            new User(
              snapshot.posts[property].uid,
              snapshot.posts[property].user,
              snapshot.posts[property].picUrl
            ),
            snapshot.posts[property].date
          ));
        }
      }

      return new Topology(
        view,
        new User(
          snapshot.owner,
          snapshot.ownerName,
          snapshot.ownerPic
        ),
        new Date(snapshot.date),
        snapshot.subscribers,
        posts,
        snapshot.description
      );
    });
  }

}
