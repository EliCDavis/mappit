import { Observable } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  uid$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.uid$ = route.params.map(x => x.name);
    this.uid$.subscribe(name => console.log('name: ', name));
  }

  ngOnInit() {
  }

}
