import { Topology } from '../map-view/topology/topology';
import { AuthenticationService } from '../authentication/authentication.service';
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

  step: Post = null;

  @Input() topology: Topology;

  /**
   * The posts to display as a list
   */
  @Input()
  set posts(newPosts: Array<Post>) {
    this.postsInput$.next(newPosts);
    this.step = null;
  }

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

  /**
   * Whether or not to display the option to the user to create a post
   */
  displayCreatePost$: Observable<boolean>

  topoOverview$: Observable<Array<any>>;

  constructor(private fb: FormBuilder, private topo: TopologyService, private auth: AuthenticationService) {

    this.topoOverview$ = topo.getTopology$()
      .filter(x => x !== null)
      .map(x => {
        const snap = x.toJSON();
        return Object.keys(snap).map(key => {
          const posts = snap[key].posts ? Object.keys(snap[key].posts).length : 0;
          return { name: key, posts: posts }
        })
      })


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
      .withLatestFrom(this.postCreationPoint$, (a, b) => ({ ...a, mapData: { lat: b.lat, lon: b.lng, type: 'Point' } }))
      .subscribe(x => {
        this.topo.createPost(this.topology.getName(), x.title, x.content, x.mapData)
        this.postCreationForm.reset();
      });

    this.displayCreatePost$ = this.auth.getUser$().map(x => x !== null);

  }

  setStep(post) {
    this.step = post;
    this.onPostOpen.next(post);
  }

  openAddPost() { this.onPostCreationModeChange.next('point'); }
  closeAddPost() { this.onPostCreationModeChange.next(''); }

  post() {
    this.postSubmission$.next(this.postCreationForm.value);
  }

  ngOnInit() { }

}
