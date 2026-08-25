import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {SharedService} from './shared.service';
import {Observable} from 'rxjs';

@Injectable()
class TokenInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const userInfo = this.sharedService.getUserInfoFromLocalStorage();
    const token = userInfo ? userInfo.userToken : '';
    request = request.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    return next.handle(request);
  }
}
export {TokenInterceptor};
