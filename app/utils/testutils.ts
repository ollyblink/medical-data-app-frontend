import {NavigationExtras} from "@angular/router";
export class RouterStub { //Stub instead of real Router. See LoginService for en example of real Instance spying
  navigate(commands: any[], extras?: NavigationExtras) {//Make sure the signature matches the real one!
    return commands[0];
  }
}

