import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from "../register/register.component";
import {LoginComponent} from "../login/login.component";
import {DataComponent} from "../data/owndata/data.component";
import {LogoutComponent} from "../logout/logout.component";
import {ConsentDataComponent} from "../data/consentdata/consentdata.component";
import {GrantConsentComponent} from "../data/grantconsent/grantconsent.component";


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'data',
    component: DataComponent
  },

  {
    path: 'consentdata',
    component: ConsentDataComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'grantconsent',
    component: GrantConsentComponent
  }
];

/**
 * All routes
 *
 * @type {ModuleWithProviders}
 */
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
