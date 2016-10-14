import {Component, OnInit} from '@angular/core'
import {LogoutService} from "./logout.service";

@Component(
  {
    selector: "logout",
    templateUrl: 'app/logout/logout.component.html',
    styleUrls: ['app/logout/logout.component.css'],
    providers: [LogoutService]
  }
)
export class LogoutComponent implements OnInit {
  /** Message to be displayed if server responses*/
  message: string;

  constructor(private logoutService: LogoutService) {

  }

  /** Logs an existing user out of the current session */
  public logout(): void {
    this.logoutService.logout().then(message => {
      this.message = message;
       localStorage.removeItem('user');
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.logout();
    } else {
      this.message = "No user to log out.";
    }
  }
}
