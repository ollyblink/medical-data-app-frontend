import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './app/app.component';
import {FormsModule} from "@angular/forms";
import {HttpModule}    from '@angular/http';

import {routing} from './app/app.routing';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {DataComponent} from "./data/owndata/data.component";
import {LogoutComponent} from "./logout/logout.component";
import {ConsentDataComponent} from "./data/consentdata/consentdata.component";
import {GrantConsentComponent} from "./data/grantconsent/grantconsent.component";
import {DropdownModule} from "ng2-dropdown";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DropdownModule
  ],
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DataComponent,
    ConsentDataComponent,
    LogoutComponent,
    GrantConsentComponent
  ],

  bootstrap: [AppComponent]
})

/**
 * Configuration of all modules and which Component to bootstrap
 */
export class AppModule {

}
