import {Injectable} from '@angular/core';
import {Response, Http} from '@angular/http';
import {ErrorHandler} from '../utils/errorhandler';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


import {User} from "../models/user";
import {credentials} from "../utils/credentials";
import {postRequestOptionsWithCredentials} from "../utils/requestoptionconfigs";


@Injectable()
export class LoginService {

  /** URL to the login page */
  private url: string;

  public constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/";
  }

  /**
   * Tries to log in to the web server according to a user's credentials.
   * @param user object holding username and password to log in
   * @returns {Promise<any>|Promise<T>}
   */
  public login(user: User): Promise<any> {
    let body = JSON.stringify({username: user.username, password: user.password});

    return this.http.post(this.url, body, postRequestOptionsWithCredentials)
      .map((res: Response) => res.json())
      .toPromise()
      .catch(ErrorHandler.handleError)
  }
}
