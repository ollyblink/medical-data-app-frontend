import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from '../utils/errorhandler'
import 'rxjs/add/operator/toPromise';
import {credentials} from '../utils/credentials';
import {postRequestOptionsWithoutCredentials} from '../utils/requestoptionconfigs';
import {User} from "../models/user";

@Injectable()
export class RegisterService {

  /** URL to Post register*/
  private url: string;

  public constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/register";
  }

  public register(user: User): Promise<any> {
    return this.http.post(this.url, JSON.stringify({
      username: user.username,
      password: user.password
    }), postRequestOptionsWithoutCredentials)
      .map((res: Response) => res.json().message)
      .toPromise()
      .catch(ErrorHandler.handleError);
  }
}


