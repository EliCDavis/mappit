import { Topology } from './topology';
import { Post } from '../post';
import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class TopologyService {

  topoUpdates$: Subject<firebase.database.DataSnapshot>;

  todoCreatePostRequest$: Subject<any>;

  constructor(private db: AngularFireDatabase) {
    this.topoUpdates$ = new Subject<any>();
    db.database.ref('topologys').on('value', (x) => this.topoUpdates$.next(x));
    this.todoCreatePostRequest$ = new Subject<any>();
  }

  createPost(topo: string, title: string, content: string, mapData: any): firebase.database.ThenableReference {
    return this.db.database.ref(`topologys/${topo}/posts`).push({
      title: title,
      content: content,
      mapData: mapData
    });
  }

  getTopology$(view: string): Observable<Topology> {
    return this.topoUpdates$.map(x => {
      const snapshot = x.child(view).toJSON() as any;

      // Make sure we're not trying to load a subreddit that doesn't exist
      if(snapshot === null){
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
            snapshot.posts[property].mapData
          ));
        }
      }

      return new Topology(view, snapshot.owner, snapshot.subscribers, posts, snapshot.description);
    });
  }

}
