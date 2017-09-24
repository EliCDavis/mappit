import { Observable, Subject } from 'rxjs/Rx';
import { Post } from '../map-view/post';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  postsInput$: Subject<Array<Post>>;

  posts$: Observable<Array<Post>>;
  
  step: Post = new Post('','','','');

  @Input()
  set posts(newPosts: Array<Post>) {
    this.postsInput$.next(newPosts);
    this.step = null;
  }

  @Input() title: string;
  @Input() description: string;

  @Input() 
  set mapClick(click:Subject<Post>) {
    click.subscribe(x=> {
      this.step = x;
    });  
  }

  /**
   * Emits whenever someone clicks on a post in the side bar
   */
  @Output() onPostOpen = new EventEmitter<Post>();

  constructor() { 
    this.postsInput$ = new Subject<Array<Post>>();

    this.posts$ = this.postsInput$
      .filter(x => x !== null)

    this.posts$.subscribe(x => console.log(x));
  }

  setStep(post) {
    this.step = post;
    this.onPostOpen.next(post);
  }

  ngOnInit() {
    
  }

}
