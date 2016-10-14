import {Component} from "@angular/core";
import {User} from "../models/user";
import {RegisterService} from "./register.service";
import {Router} from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: 'app/register/register.component.html',
  styleUrls: ['app/register/register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent {
  static WAITING_TEXT: string = "Registering new user... This may take a while (10 - 20 seconds), please be patient! You will be redirected to the login page on success.";

  /** Message from the server to be displayed */
  private message: string = "";
  /** Model that is altered in the form and then sent to the server to register a new user */
  private userModel = new User("", "");


  constructor(private router: Router, private registerService: RegisterService) {
  }


  register(): void {
    this.message = RegisterComponent.WAITING_TEXT;
    this.registerService.register(this.userModel).then(message => {
      this.message = message;
      let link = ['/login'];
      this.router.navigate(link);
    });
  }

  public setUserModel(user: User): void {
    this.userModel = user;
  }

}
