import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from '../../utils/errorhandler'
import {credentials} from "../../utils/credentials";
import {Data} from "../../models/data";
import {postRequestOptionsWithCredentials} from "../../utils/requestoptionconfigs";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/**
 * Service provides access to own data. Create, Read, and Deleting of datasets owned by the current user.
 */
@Injectable()
export class DataService {

  /** Base URL for data actions */
  private url: string;

  constructor(private http: Http) {
    this.url = credentials.host + ":" + credentials.port + "/data/";
  }


  /**
   *
   * @returns {any} returns an array of data items (spirometryData) and the user these items belong to, or an error message.
   */
  public getOwnData(): Promise<Data[]> {
    if (localStorage.getItem('user')) {
      return this.http.get(this.url + 'username/' + localStorage.getItem('user'), {withCredentials: true})
        .map((res: Response) => res.json().spirometryData)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }

  /**
   * Deletes a data item specified by its title.
   *
   * @param title of the data item to delete
   * @returns {string} message if the item could be deleted.
   */
  public deleteDataItem(title: string): Promise<string> {
    if (localStorage.getItem('user')) {
      let targetUrl = this.url + 'user/' + localStorage.getItem('user') + "/item/" + title;
      return this.http.delete(targetUrl, {withCredentials: true})
        .map((res: Response) => res.json().message)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }

  /**
   * Adds a new data item for the specified user.
   *
   * @param data the new data item to be created
   * @returns {string} message if the item could be added.
   */
  public addDataItem(data: Data): Promise<string> {
    if (localStorage.getItem('user')) {
      let body = JSON.stringify({
        title: data.title,
        fvc: data.fvc,
        fev1: data.fev1
      });
      return this.http.post(this.url, body, postRequestOptionsWithCredentials)
        .map((res: Response)=>res.json().message)
        .toPromise()
        .catch(ErrorHandler.handleError);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ErrorHandler.USER_NOT_FOUND);
      });
    }
  }
}
