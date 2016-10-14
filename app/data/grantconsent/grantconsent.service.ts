import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from "../../utils/errorhandler";
import {credentials} from "../../utils/credentials";
import {postRequestOptionsWithCredentials} from "../../utils/requestoptionconfigs";

@Injectable()
export class GrantConsentService {
  private url: string;

  public constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/consents/";
  }

  public grantDataAccess(username: string): Promise<string> {
    if (localStorage.getItem('user')) {
      return this.http.post(this.url, {receiver: username}, postRequestOptionsWithCredentials)
        .map((res: Response) => res.json().message)
        .toPromise()
        .catch(ErrorHandler.handleError)
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }

  public getUsersToGrantDataAccessTo(): Promise<string[]> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url, {withCredentials: true})
        .map((res: Response) => res.json().authorisableUsers)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }


  public getSentUsers(): Promise<string[]> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url + 'sent', {withCredentials: true})
        .map((res: Response) => res.json().consentedUsers)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }

  public deleteSentUser(receiver: string): Promise<string> {
    if (localStorage.getItem('user')) {
      return this.http.delete(this.url + 'sender/' + localStorage.getItem('user') + "/receiver/" + receiver, {withCredentials: true})
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
