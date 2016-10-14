import {Component, OnInit} from '@angular/core';
import {GrantConsentService} from "./grantconsent.service";

@Component({
  selector: 'grant-consent',
  templateUrl: 'app/data/grantconsent/grantconsent.component.html',
  styleUrls: ['app/data/grantconsent/grantconsent.component.css'],
  providers: [GrantConsentService]
})

/**
 * Enables a user to grant access to own data to other users.
 * Shows who can view own data and allows user to delete a granted consent again.
 */
export class GrantConsentComponent implements OnInit {
  /** Users that can receive a consent*/
  private usersToConsent: string[] = [];
  /** Users that can already see the own data (all users in the system minus usersToConsent).*/
  private sentUsers: string[] = [];

  /** possible message received from the server */
  private message: string;

  public constructor(private grantConsentService: GrantConsentService) {

  }

  /**
   * Whenever the select option is changed, the selected user is granted access to the data.
   *
   * @param receiver the user to allow access to the data
   */
  public onChange(receiver: string): void {
    this.grantDataAccess(receiver);
  }

  /**
   * Retrieves all users that can be granted access to the data and that are not yet granted already.
   * Initially, when nobody is allowed access yet, these are all users in the system.
   */
  public getUsersToGrantDataAccessTo(): void {
    this.grantConsentService.getUsersToGrantDataAccessTo().then(usersToConsent => this.usersToConsent = usersToConsent);
  }

  /**
   * Loads all users that can be granted access to the data and all those that can already access the data.
   */
  ngOnInit(): void {
    this.getUsersToGrantDataAccessTo();
    this.getSentUsers();
  }


  /**
   * Retrieves all users that can already view the user's data
   */
  public getSentUsers(): void {
    this.grantConsentService.getSentUsers().then(sentUsers => this.sentUsers = sentUsers);
  }

  /**
   * Invokes the method on the server to grant data access.
   * Reloads the list of possible users to grant data access to on success.
   *
   * @param receiver the user to allow access to the data
   */
  public grantDataAccess(receiver: string): void {
    this.grantConsentService.grantDataAccess(receiver).then(message => {
      this.message = message;
      this.ngOnInit();//reload
    });
  }

  /**
   * Deletes a consent of a user that can already view the user's data
   * Reloads the list of possible users to grant data access to on success.
   *
   * @param receiver user that will not be able to view the data anymore after the action finishes.
   */
  public deleteSentUser(receiver: string): void {
    this.grantConsentService.deleteSentUser(receiver).then(message => {
      this.message = message;
      this.ngOnInit();//reload
    });
  }

}
