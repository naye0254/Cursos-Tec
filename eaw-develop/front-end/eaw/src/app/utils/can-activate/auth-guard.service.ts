import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {SharedService} from '../../shared/shared.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
class AuthGuardService implements CanActivate {
  constructor(public router: Router, private sharedService: SharedService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (localStorage.getItem('userDetail') != null) {
      const rolesByPage = route.data.roles as Array<string>;
      const user = JSON.parse(
        this.sharedService.getItemFromLocalStorage('userDetail'),
      );
      return this.sharedService
        .verifyAccessTokenStillActive(user.userToken, user.id)
        .pipe(
          map(success => {
            let isLogged = false;
            rolesByPage.forEach(role => {
              if (role === user.roleTypesId) {
                isLogged = true;
              }
            });
            return isLogged;
          }),
          catchError(error => {
            this.sharedService.deleteItemFromLocalStorage('userDetail');
            this.router.navigate(['session-expired']);
            return of(false);
          }),
        );
    } else {
      const isIndirectClient =
        JSON.parse(
          JSON.stringify(
            this.sharedService.getItemFromLocalStorage('isIndirectClient'),
          ),
        ) === 'true'
          ? true
          : false;

      if (isIndirectClient) {
        return of(true);
      } else {
        this.router.navigate(['']);
      }
      return of(false);
    }
  }
}
export {AuthGuardService};
