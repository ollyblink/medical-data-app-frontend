import {Component} from '@angular/core';


@Component({
  selector: 'root',
  templateUrl: 'app/app/app.component.html',
  styleUrls: ['app/app/app.component.css']

})
/**
 * Root component for the app. Currently contains all the links to routes.
 * All other views are rendered within the base view here.
 *
 */
export class AppComponent {
  /** Required to be able to use it in the corresponding html file*/
  private storage = localStorage;
}
