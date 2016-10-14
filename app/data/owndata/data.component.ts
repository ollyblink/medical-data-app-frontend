import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from "./data.service";
import {Data} from "../../models/data";

@Component({
  selector: 'own-data',
  templateUrl: 'app/data/owndata/data.component.html',
  styleUrls: ['app/data/owndata/data.component.css'],
  providers: [DataService]
})
/**
 * Component to create, read, and delete data items of a user currently logged in
 */
export class DataComponent implements OnInit {

  /** All datasets of the current user. Will be retrieved from the server */
  private spirometryData: Data[] = [];
  /** Used to tottle add data item form */
  private isAddItemShown: boolean = false;
  /** whenever a message is received from the server, it is stored and displayed using message*/
  private message: string = "";
  /** Model to create a new data set */
  private dataItem = new Data("", "", null, null);


  constructor(private router: Router, private dataService: DataService) {
  }

  public setDataItem(data: Data): void {
    this.dataItem = data;
  }

  /**
   * Retrieves all data items from the server and stores them in spirometryData
   */
  public getOwnData(): void {
    this.dataService.getOwnData().then(spirometryData => {
      this.spirometryData = spirometryData;
    });
  }

  /**
   * Deletes a data item specified by its title
   *
   * @param title of the data item to delete
   */
  public deleteDataItem(title: string): void {
    this.message = title;
    this.dataService.deleteDataItem(title).then(message => {
      this.message = message;
      //reload
      this.getOwnData();
    });
  }

  /**
   * Used in the view to toggle the "add data item" part
   */
  public showAddItem(): void {
    this.isAddItemShown = (this.isAddItemShown == false ? true : false);
  }

  /**
   * Adds a new data item as currently stored in the dataItem model variable
   */
  public addDataItem(): void {
    if (localStorage.getItem('user')) {
      this.dataService.addDataItem(this.dataItem).then(message => {
        this.message = message;
        this.showAddItem();
        this.dataItem = new Data("","", null, null);
        //reload
        this.getOwnData();
      });
    }
  }

  /**
   * Navigates to /grantconsent
   */
  public showGrantConsent(): void {
    this.router.navigate(['/grantconsent']);
  }

  /**
   * On initialization, all data items of the user logged in are retrieved.
   */
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.getOwnData();
    }
  }
}
