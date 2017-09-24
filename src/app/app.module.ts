import { AuthGuard } from './auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TopologyService } from './map-view/topology/topology.service';
import { AuthenticationService } from './authentication/authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

// Firebase
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

// Googlemaps
import {
  AgmCoreModule
} from '@agm/core';

// Material
import {
  MdButtonModule,
  MdCheckboxModule,
  MdSidenavModule,
  MdToolbarModule,
  MdMenuModule,
  MdIconModule,
  MdExpansionModule,
  MdInputModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

// Personal Styling
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { MapViewComponent } from './map-view/map-view.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { CreateTopoComponent } from './create-topo/create-topo.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FrontpageComponent,
    MapViewComponent,
    LoginButtonComponent,
    CreateTopoComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvL0yw3XN2WAzzkzPIN_fXyceRYV_uxa8'
    }),

    BrowserModule,

    // Material
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdSidenavModule,
    MdToolbarModule,
    MdMenuModule,
    MdExpansionModule,
    MdIconModule,
    MdInputModule,

    HttpModule,
    ReactiveFormsModule,

    // Other Essentials
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: '', component: FrontpageComponent },
      { path: 'new-topo', component: CreateTopoComponent, canActivate: [AuthGuard] },
      { path: 't', component: MapViewComponent },
      { path: 't/:name', component: MapViewComponent }
    ]),

    // Firebase
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyC77AJS7iHycOS1noZIe4LQGz3IqAzIq3M",
      authDomain: "mappit-4b1f0.firebaseapp.com",
      databaseURL: "https://mappit-4b1f0.firebaseio.com",
      projectId: "mappit-4b1f0",
      storageBucket: "mappit-4b1f0.appspot.com",
      messagingSenderId: "621290027934"
    }, 'mappit'),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AuthenticationService,
    TopologyService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
