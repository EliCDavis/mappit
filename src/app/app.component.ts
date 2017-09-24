import { AuthenticationService } from './authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, auth: AuthenticationService) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_add_circle_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('point', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_location_on_black_24px.svg'));
    iconRegistry.addSvgIcon('starred', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_star_black_24px.svg'));
    iconRegistry.addSvgIcon('unstarred', sanitizer.bypassSecurityTrustResourceUrl('assets/ic_star_border_black_24px.svg'));
  }

  ngOnInit() { }

}