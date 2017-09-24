import { AuthenticationService } from '../../authentication/authentication.service';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';
import { TopologyService } from '../topology/topology.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subsribe-button',
  templateUrl: './subsribe-button.component.html',
  styleUrls: ['./subsribe-button.component.css']
})
export class SubsribeButtonComponent {

  subscribed$: Observable<boolean>;

  topo$: ReplaySubject<string>;

  toggle$: Subject<any>;

  @Input()
  set topo(newTopo: string) {
    console.log(newTopo);
    this.topo$.next(newTopo)
  }

  constructor(private topoService: TopologyService, private authService: AuthenticationService) {
    this.topo$ = new ReplaySubject<string>(1);
    this.toggle$ = new Subject<any>();

    this.subscribed$ = this.topo$
      .combineLatest(this.authService.getUser$(), (topo, user) => {
        console.log(topo, user)
        if (user === null) {
          return null;
        }
        return user.subscriptions ? !!user.subscriptions[topo] : false;
      })
      .filter(x => x !== null)

    this.toggle$
      .withLatestFrom(this.topo$, this.subscribed$, (x, topo, subbed) => ({ topo, subbed}))
      .subscribe(x => {
        x.subbed? this.topoService.unSubscribeToTopo(x.topo) : this.topoService.subscribeToTopo(x.topo);
      });

  }

  toggle(c) {
    this.toggle$.next(c);
  }

}
