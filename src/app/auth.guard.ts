import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log(this.afAuth.auth.currentUser);
        if (this.afAuth.auth.currentUser) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/t'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}