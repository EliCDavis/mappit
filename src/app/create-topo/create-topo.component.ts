import { Router } from '@angular/router';
import { TopologyService } from '../map-view/topology/topology.service';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from '../authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-topo',
  templateUrl: './create-topo.component.html',
  styleUrls: ['./create-topo.component.css']
})
export class CreateTopoComponent implements OnInit {

  topoForm: FormGroup;

  profileUrl$: Observable<string>;

  error: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private topo: TopologyService,
    private router: Router
  ) {
    this.topoForm = this.createForm();
    this.profileUrl$ = auth.getUser$().map(x => x.photoURL);
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),

        //make sure it's only letters
        (x: FormControl) => {
          return !/[^a-z]/i.test(x.value) ?
            null : { 'letters': 'must contain only letters' }
        }
      ]],
      description: ['']
    });
  }

  createTopo() {
    const results: string = this.topo.createTopography(this.topoForm.value.title, this.topoForm.value.description)
    if (results === null) {
      this.router.navigateByUrl('t/' + this.topoForm.value.title);
      return;
    }
    this.error = results;
  }

  ngOnInit() {
  }

}
