import { TopologyService } from '../map-view/topology/topology.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Post } from '../map-view/post';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  postsInput$: Subject<Array<Post>>;

  posts$: Observable<Array<Post>>;

  step: Post;

  /**
   * The posts to display as a list
   */
  @Input()
  set posts(newPosts: Array<Post>) {
    this.postsInput$.next(newPosts);
    this.step = null;
  }

  /**
   * The name of the topography to display
   */
  @Input() title: string;

  /**
   * The description of the topography to display
   */
  @Input() description: string;

  /**
   * A stream of clicks on posts on the map
   */
  @Input()
  set postClick(click: Subject<Post>) {
    click.subscribe(x => {
      this.step = x;
    });
  }

  postCreationPoint$: Subject<{ lat: number, lng: number }>;

  @Input()
  set postCreationPoint(x: { lat: number, lng: number }) {
    if (this.postCreationPoint$) {
      this.postCreationPoint$.next(x);
    }
  }

  /**
   * Emits whenever someone clicks on a post in the side bar
   */
  @Output() onPostOpen = new EventEmitter<Post>();

  /**
   * A new string is emmitted based on the type of post we want to make
   * '' | 'point' | 'path' 
   */
  @Output() onPostCreationModeChange = new EventEmitter<string>();

  postCreationForm: FormGroup;

  postSubmission$: Subject<{ title: string, content: string }>;

  constructor(private fb: FormBuilder, private topo: TopologyService) {

    this.postSubmission$ = new Subject<{ title: string, content: string }>();

    this.postCreationPoint$ = new Subject<{ lat: number, lng: number }>();

    this.postCreationForm = fb.group({
      title: ['', Validators.required],
      content: ['']
    });

    this.postsInput$ = new Subject<Array<Post>>();

    this.posts$ = this.postsInput$
      .filter(x => x !== null)

    this.posts$.subscribe(x => console.log(x));

    this.postSubmission$
      .combineLatest(this.postCreationPoint$, (a, b) => ({ ...a, mapData: { lat: b.lat, lon: b.lng, type: 'Point' } }))
      .subscribe(x => {
        this.topo.createPost(this.title, x.title, x.content, x.mapData)
          .then(() => {
            this.postCreationForm.reset();
          })
        console.log(x)
      });

  }

  setStep(post) {
    this.step = post;
    this.onPostOpen.next(post);
  }

  openAddPost() { this.onPostCreationModeChange.next('point'); }
  closeAddPost() { this.onPostCreationModeChange.next(''); }

  post() {
    console.log('posting...')
    this.postSubmission$.next(this.postCreationForm.value);
  }

  ngOnInit() { }

}
