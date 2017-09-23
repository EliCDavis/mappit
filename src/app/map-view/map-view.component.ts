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

  // All the sidenav logic because we gotta make it fluid -_-
  sidenavMode: Observable<string>;
  sidenavOpen$: Observable<boolean>;
  sidenavToggleClick$: Subject<any>;
  sidenavCloseRequest$: Subject<any>;

  constructor(private route: ActivatedRoute, private topoService: TopologyService) {

    this.sidenavToggleClick$ = new Subject<any>();
    this.sidenavCloseRequest$ = new Subject<any>();

    this.topology$ = route.params
      .filter(url => url && url.name)
      .map(url => topoService.getTopology$(url.name))
      .switch()

    this.posts$ = this.topology$.map(topo => topo.getPosts());

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
