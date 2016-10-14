import {Component, OnInit} from '@angular/core';
import {ConsentDataService} from "./consentdata.service";
import {Data} from "../../models/data";

@Component({
  selector: 'consentdata',
  templateUrl: '/app/data/consentdata/consentdata.component.html',
  styleUrls: ['/app/data/consentdata/consentdata.component.css'],
  providers: [ConsentDataService]
})

/**
 * Enables a logged-in user to see data of user's they have a consent for.
 */
export class ConsentDataComponent implements OnInit {
  private user: string = "";
  private spirometryData: Data[] = [];
  private consentedUsers: string[] = [];
  private selectedUser: string;
  private message: string;
  private msgBgColor: string;
  private msgFontColor: string;

  public constructor(private consentDataService: ConsentDataService) {

  }

  public getOtherData(username: string): void {
    this.consentDataService.getOtherData(username).then(json => {
      this.user = json.user;
      this.spirometryData = json.spirometryData;
      this.message = "";
      this.msgBgColor = "white";
      this.msgFontColor = "black";
    }).catch(error => {
      this.user = "";
      this.spirometryData = [];
      this.selectedUser ="";
      this.message = "Could not find a valid consent for the user specified!";
      this.msgBgColor = "red";
      this.msgFontColor = "white";
    });
  }

  public onChange(selectedUser: string) {
    this.selectedUser = selectedUser.trim();
    if (selectedUser.length > 0) {
      this.getOtherData(this.selectedUser);
    } else {
      //Change was initiated but select was empty --> remove existing data
      this.user = "";
      this.spirometryData = [];
    }
  }

  public getUsersToGrantConsentTo(): void {
    this.consentDataService.getUsersToGrantConsentTo().then(consentedUsers => {
      this.consentedUsers = consentedUsers;
    });
  }

  ngOnInit(): void {
    this.getUsersToGrantConsentTo();
  }

}
