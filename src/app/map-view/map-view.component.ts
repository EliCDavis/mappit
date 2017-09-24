import { User } from './user';
import { Topology } from './topology/topology';
import { Post } from './post';
import { TopologyService } from './topology/topology.service';
import { Observable, Subject } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  uid$: Observable<string>;

  topology$: Observable<Topology>;
  posts$: Observable<Array<Post>>;

  mapClick$: Subject<{ lat: number, lng: number }>;

  centerChange$: Subject<{ lat: number, lng: number }>;

  postCreationLocation$: Observable<{ lat: number, lng: number }>;

  postClicks$: Subject<Post>;

  // What mode we're currently building a post under
  postCreationMode$: Subject<string>;

  // whether or not to display our point creation
  displayCreationPoint: boolean;

  // Whenever the user has chosen a post without the map control
  postOpen$: Subject<Post>;

  // Controlling the maps lattitude to view posts
  lat$: Observable<number>;

  // Controlling the maps longitude to view posts
  lon$: Observable<number>;

  // All the sidenav logic because we gotta make it fluid -_-
  sidenavMode: Observable<string>;
  sidenavOpen$: Observable<boolean>;
  sidenavToggleClick$: Subject<any>;
  sidenavCloseRequest$: Subject<any>;

  constructor(private route: ActivatedRoute, private topoService: TopologyService) {

    this.postCreationMode$ = new Subject<string>();
    this.displayCreationPoint = false;

    this.mapClick$ = new Subject<{ lat: number, lng: number }>();

    this.centerChange$ = new Subject<{ lat: number, lng: number }>();

    this.postCreationLocation$ = this.centerChange$
      .sample(this.postCreationMode$.filter(x => x !== ''))
      .merge(this.mapClick$)
      .startWith({ lat: 0, lng: 0 });

    // Two events that would warrent programatic change of map view
    this.postClicks$ = new Subject<Post>();
    this.postOpen$ = new Subject<Post>();

    // Controlling lat and lon 
    const changeView$ = this.postClicks$.merge(this.postOpen$);
    this.lat$ = changeView$.map(post => post.getLat());
    this.lon$ = changeView$.map(post => post.getLon());

    this.sidenavToggleClick$ = new Subject<any>();
    this.sidenavCloseRequest$ = new Subject<any>();

    // Stream of topology updates as the url changes
    this.topology$ = topoService
      .getTopology$()
      .combineLatest(this.route.params.filter(url => url && url.name), (x, url) => {
        const snapshot = x.child(url.name).toJSON() as any;

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
          url.name,
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

    // seperating posts from topo to make things easier
    this.posts$ = this.topology$
      .filter(x => x !== null)
      .map(topo => topo.getPosts());
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

  markerClick(post: Post) {
    this.postClicks$.next(post);
  }

  postOpen(post: Post) {
    this.postOpen$.next(post);
  }

  centerChange(change) {
    this.centerChange$.next(change);
  }

  postCreationMode(mode: string) {
    this.postCreationMode$.next(mode);
    this.displayCreationPoint = mode != '';
  }

  mapClick(a) {
    this.mapClick$.next(a.coords);
  }

}
