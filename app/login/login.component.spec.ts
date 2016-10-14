import {TestBed, ComponentFixture, async, fakeAsync, tick, inject} from "@angular/core/testing";
import {LoginComponent} from "./login.component";
import {LoginService} from "./login.service";
import {Router} from "@angular/router";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {User} from "../models/user";
import {RouterStub} from "../utils/testutils";


describe('LoginComponent', ()=> {

  /**Fixture for the component under test*/
  let fixture: ComponentFixture<LoginComponent>;
  /**Component under test*/
  let comp: LoginComponent;
  /**Service required to spy on*/
  let loginService: LoginService;
  /**Actual service spy*/
  let spy: any;
  /**Element of the DOM*/
  let de: DebugElement;
  /**Actual element to perform actions on*/
  let el: HTMLElement;

  /**
   * called async to compile the components (they contain templateUrls and external stylesheets
   */
  beforeEach(async(() => { //Needs to be called async to compile components (?)
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [LoginComponent],
      providers: [
        {provide: LoginService} //Uses the real service to spy on
        ,
        {provide: Router, useClass: RouterStub} //need to inject the router to spy on it. Doesn't work with injector.get like below somehow
      ]
    })
      .compileComponents(); // compile template and css if they are externally stored!
  }));

  /**
   * Create the test bed for the application
   */
  beforeEach(()=> {
    localStorage.removeItem('user');
    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;

    //Get the real service to spy on instead of mocking it
    loginService = fixture.debugElement.injector.get(LoginService);
    //Spy on an actual instance instead of faking it
    //Return an own value to test for instead of using actual services
    spy = spyOn(loginService, 'login').and.returnValue(Promise.resolve({user: 'o1', message: "user o1 logged in"}));
  });

  afterEach(()=> {
    localStorage.removeItem('user'); //Make sure to clear it again
  });

  it('should call login and display a response messages', fakeAsync(inject([Router], (router: Router) => {//use fakeAsync together with tick()
    const routerSpy = spyOn(router, 'navigate');


    //No message shown before there was no login call
    de = fixture.debugElement.query(By.css('.message'));
    expect(de).toBe(null, 'Should not exist yet');
    expect(loginService.login).toHaveBeenCalledTimes(0);

    //Set the login data (model)
    comp.setUserModel(new User("o1", "o1"));
    fixture.detectChanges();
    //no user before login!
    expect(localStorage.getItem('user')).toBe(null);


    expect(loginService.login).toHaveBeenCalledTimes(0);
    tick(); //Somehow required, such that the fields are set

    //Click the submit button
    fixture.debugElement.query(By.css('#submit-button')).nativeElement.click();
    fixture.detectChanges();

    //Before the call returns, Logging in ... should be displayed
    el = fixture.debugElement.query(By.css('.message')).nativeElement;
    expect(el.textContent).toContain(LoginComponent.WAITING_TEXT, "waiting message");
    expect(loginService.login).toHaveBeenCalledTimes(1);

    tick(); //Await the callback
    fixture.detectChanges();
    expect(loginService.login).toHaveBeenCalledTimes(1); // just to see if there is no hidden call or sth.

    //On successful login, there should be the message that the user logged
    //in successfully, before the router navigates to the user's data page.
    el = fixture.debugElement.query(By.css('.message')).nativeElement;
    expect(el.textContent).toContain("user o1 logged in", "waiting message");
    //Assure login redirects to data
    expect(routerSpy.calls.first().args[0][0]).toBe('/data');
    expect(router.navigate).toHaveBeenCalledTimes(1);

    //user should be set after login
    expect(localStorage.getItem('user')).toBe('o1');
  })));
});
