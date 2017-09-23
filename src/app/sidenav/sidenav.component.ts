import { Observable, Subject } from 'rxjs/Rx';
import { Post } from '../map-view/post';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  postsInput$: Subject<Array<Post>>;

  posts$: Observable<Array<Post>>;
  
  @Input()
  set posts(newPosts: Array<Post>) {
    this.postsInput$.next(newPosts);
  }

  constructor() { 
    this.postsInput$ = new Subject<Array<Post>>();
    this.posts$ = this.postsInput$
      .filter(x => x !== null)

    this.posts$.subscribe(x => console.log(x))
  }

  ngOnInit() {
    
  }

}
