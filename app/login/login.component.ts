import {Component} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from '@angular/router';
import {User} from "../models/user";

@Component({
  selector: 'login',
  templateUrl: 'app/login/login.component.html',
  styleUrls: ['app/login/login.component.css'],
  providers: [LoginService]
})

export class LoginComponent {
  /** Text shown once login is clicked*/
  static WAITING_TEXT: string = "Logging in ...";

  /** Response message of the server to be displayed on the website*/
  private message: string;

  /** User data model used in the form to finally log in */
  private userModel = new User("", "");

  /**
   * @param router to route to certain locations
   * @param loginService service to handle http login to the backend
   */
  public constructor(private router: Router, private loginService: LoginService) {
  }


  /**
   * Tries to log in according to the user specified in the userModel. Stores the user in the localStorage on successful log in.
   */
  public login(): void {
    this.message = LoginComponent.WAITING_TEXT;

    this.loginService.login(this.userModel).then(json => {
      this.message = json.message;
      localStorage.setItem('user', json.user);
      this.router.navigate(['/data']);
    });
  }

  public getUserModel(): User {
    return new User(this.userModel.username, this.userModel.password);
  }

  public setUserModel(user: User): void {
    this.userModel = user;
  }
}
