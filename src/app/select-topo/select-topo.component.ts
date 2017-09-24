import { Router } from '@angular/router';
import { Topology } from '../map-view/topology/topology';
import { TopologyService } from '../map-view/topology/topology.service';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
@Component({
  selector: 'app-select-topo',
  templateUrl: './select-topo.component.html',
  styleUrls: ['./select-topo.component.css']
})
export class SelectTopoComponent implements OnInit {

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  constructor(private topo: TopologyService, private router: Router, public dialogRef: MdDialogRef<SelectTopoComponent>) {
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .startWith(null)
      .combineLatest
      (
      topo.getTopology$()
        .filter(x => x !== null)
        .map(x => {
          const snap = x.toJSON();
          console.log(snap)
          return Object.keys(snap).map(key => {
            const posts = snap[key].posts ? Object.keys(snap[key].posts).length : 0;
            return { name: key, posts: posts }
          })
        }), (state, topos) => {
          console.log(state, topos)
          return state ? this.filterStates(topos, state) : topos;
        });
  }

  filterStates(topo: Array<{ name: string }>, name: string) {
    return topo.filter(t => t.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  optionSelected(x) {
    this.router.navigateByUrl('t/' + x.option.value);
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
