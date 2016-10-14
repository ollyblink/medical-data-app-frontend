import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from "../../utils/errorhandler";
import {credentials} from "../../utils/credentials";

@Injectable()
export class ConsentDataService {
  private url: string;

  public constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/";
  }

  public getOtherData(username: string): Promise<any> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url + 'data/username/' + username, {withCredentials: true})
        .map((res: Response) => res.json())
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });

    }
  }

  public getUsersToGrantConsentTo(): Promise<string[]> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url + "consents/received", {withCredentials: true})
        .map((res: Response) => {
          if (res.json().consentedUsers) {
            return res.json().consentedUsers;
          } else {
            return {consentedUsers: []};
          }
        })
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }
}
