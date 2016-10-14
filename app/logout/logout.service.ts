import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from "../utils/errorhandler";
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';
import {credentials} from "../utils/credentials";

@Injectable()
export class LogoutService {

  private url: string;

  constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/logout";
  }

  public logout(): Promise<string> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url, {withCredentials: true})
        .map((res: Response) => res.json().message)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }

  }
}
