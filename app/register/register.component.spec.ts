import {RegisterComponent} from "./register.component";
import {ComponentFixture, TestBed, async, inject, fakeAsync, tick} from "@angular/core/testing";
import {RegisterService} from "./register.service";
import {DebugElement} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterStub} from "../utils/testutils";
import {Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {User} from "../models/user";

/**
 * @See login.component.spec.ts for more detailed comments of how to instantiate etc.
 */
describe('RegisterComponent', ()=> {
  /**Fixture for the component under test*/
  let fixture: ComponentFixture<RegisterComponent>;
  /**Component under test*/
  let comp: RegisterComponent;
  /**Service required to spy on*/
  let registerService: RegisterService;
  /**Actual service spy*/
  let spy: any;
  /**Element of the DOM*/
  let de: DebugElement;

  /**
   * called async to compile the components (they contain templateUrls and external stylesheets
   */
  beforeEach(async(() => { //Needs to be called async to compile components (?)
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [RegisterComponent],
      providers: [
        {provide: RegisterService} //Uses the real service to spy on
        ,
        {provide: Router, useClass: RouterStub} //need to inject the router to spy on it. Doesn't work with injector.get like below somehow
      ]
    })
      .compileComponents(); // compile template and css if they are externally stored!
  }));

  beforeEach(()=> {
    fixture = TestBed.createComponent(RegisterComponent);
    comp = fixture.componentInstance;
    registerService = fixture.debugElement.injector.get(RegisterService);
    spy = spyOn(registerService, 'register').and.returnValue(Promise.resolve( "Successfully created user with username o1"));
  });

  it('should call register and display a response message', fakeAsync(inject([Router], (router: Router)=> {
    const routerSpy = spyOn(router, 'navigate');

    //No message shown before there was a call to register
    de = fixture.debugElement.query(By.css('.message'));
    expect(de).toBe(null, 'Should not exist yet');
    expect(registerService.register).toHaveBeenCalledTimes(0);

    //Set user model
    comp.setUserModel(new User('o1', 'o1'));
    fixture.detectChanges();

    expect(registerService.register).toHaveBeenCalledTimes(0);
    tick();

    //Click submit
    fixture.debugElement.query(By.css('#submit-button')).nativeElement.click();
    fixture.detectChanges();

    //Before the call returns, a waiting message should be displayed
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain(RegisterComponent.WAITING_TEXT, 'Waiting message');
    expect(registerService.register).toHaveBeenCalledTimes(1);

    tick();
    fixture.detectChanges();

    //Successful registration creates a new user. Should be visible in the message
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('Successfully created user with username o1', 'registered successfully');

    //Assure it is redirected to /login on successful registration
    expect(routerSpy.calls.first().args[0][0]).toBe('/login');
    expect(router.navigate).toHaveBeenCalledTimes(1);

  })));

});
