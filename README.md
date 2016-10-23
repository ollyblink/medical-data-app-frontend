# medical-data-app-frontend

## Introduction and Technology Stack

This is the frontend part of the medical data app written in <a href="https://angular.io">Angular2</a> that requires the backend found at <a href="https://github.com/ollyblink/medical-data-app-backend.git">https://github.com/ollyblink/medical-data-app-backend.git</a> to work. Tests make use of <a href="https://karma-runner.github.io/1.0/index.html">Karma</a> and <a href="http://jasmine.github.io/">Jasmine</a>. The base structure is taken from the quickstart example at <a href="https://angular.io/docs/ts/latest/quickstart.html">angular.io</a>. 

## Purpose
The purpose of this application is to provide a user interface for the backend part mentioned before for the user to register, login, and manage both data and consents (see <a href="https://github.com/ollyblink/medical-data-app-backend.git">https://github.com/ollyblink/medical-data-app-backend.git</a> for a proper description of the functionality). 

## Installation  Guide

1. `git clone https://github.com/ollyblink/medical-data-app-fronend.git`
2. `cd medical-data-app-frontend`
3. `npm install`
  

## Development Guide
 
2. `npm start`: compiles the typescript files and runs the server (lite in this case). After successful compilation, the web browser opens automatically on the login page. 
3. `npm test`: runs test suite. 

## App Structure
For each subpage, there exists a corresponding component, service, html- and css-file. However, most css files are empty but may be altered in a later stage. Currently, most of the app is formatted using <a href="http://getbootstrap.com/">Twitter Bootstrap</a> (v. 3.3.6). The structure corresponds to the way apps are built on the <a href="https://angular.io/docs/ts/latest/">official Angular2 page</a>, where services provide REST data access to the middleware and components handle data representation on the sub page. For each component and service, there exists a corresponding .spec file. Spec files are Jasmine test files. 
## Functionality
### Register and Login
The Tab "Login" provides an input form that allows a registered user to log in. Should the user not be logged in yet, the "Register" tab has to be clicked before and the new user registered. It will then automatically redirect to the login after successful registration.

The tabs provided after log in are: "My Data", "Data of other users", and "Logout"
### My Data
This tab is a drop down. The first entry "Show data" allows a user to see own data items, add new items, or remove items with the (x) after each entry. The "Allow access to data" tab allows a user to grant all other registered users access to own data items. All consented users are listed on the right, and a consent can be removed again by clicking the (x) after each entry.

### Data of other users
This tab allows a user to see the data items of users that granted access to their data items. 

### Logout
Logs a user out.

## Known Issues
- There is one test that does not work for the LogoutComponent. It is currently skipped (can be seen in the debug output when `npm test` is run).

## Future Work
- Currently, there is no input validation which should be implemented.