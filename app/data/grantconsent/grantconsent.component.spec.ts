import {ComponentFixture, async, TestBed, fakeAsync, tick} from "@angular/core/testing";
import {GrantConsentComponent} from "./grantconsent.component";
import {GrantConsentService} from "./grantconsent.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {Router} from "@angular/router";
import {RouterStub} from "../../utils/testutils";
import {By} from "@angular/platform-browser";

describe('GrantConsentComponent', ()=> {
  let fixture: ComponentFixture<GrantConsentComponent>;
  let comp: GrantConsentComponent;
  let grantConsentService: GrantConsentService;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [GrantConsentComponent],
      providers: [
        {provide: GrantConsentService},
        {provide: Router, useClass: RouterStub}
      ]
    }).compileComponents();
  }));

  beforeEach(()=> {
    localStorage.setItem('user', 'o1')
    fixture = TestBed.createComponent(GrantConsentComponent);
    comp = fixture.componentInstance;
    grantConsentService = fixture.debugElement.injector.get(GrantConsentService);
  });

  afterEach(()=> {
    localStorage.removeItem('user');
  });

  it("#onInit: should not show data before OnInit", ()=> {
    spyOn(grantConsentService, 'getUsersToGrantDataAccessTo').and.returnValue(Promise.resolve(['u1', 'u3']));
    spyOn(grantConsentService, 'getSentUsers').and.returnValue(Promise.resolve(['u2']));

    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to display');
    expect(fixture.debugElement.query(By.css('#users-to-consent'))).toBe(null, 'no users loaded yet');
    expect(fixture.debugElement.query(By.css('#sent-users'))).toBe(null, 'no users loaded yet');
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(0);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(0);
  });

  it("#onInit: should not show data after component initialized because it did not yet return (async)", ()=> {
    spyOn(grantConsentService, 'getUsersToGrantDataAccessTo').and.returnValue(Promise.resolve(['u1', 'u3']));
    spyOn(grantConsentService, 'getSentUsers').and.returnValue(Promise.resolve(['u2']));

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to display');
    expect(fixture.debugElement.query(By.css('#users-to-consent'))).toBe(null, 'no users loaded yet');
    expect(fixture.debugElement.query(By.css('#sent-users'))).toBe(null, 'no users loaded yet');
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(1);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(1);
  });


  it('#OnInit: should show users after method returned', fakeAsync(()=> {
    spyOn(grantConsentService, 'getUsersToGrantDataAccessTo').and.returnValue(Promise.resolve(['u1', 'u3']));
    spyOn(grantConsentService, 'getSentUsers').and.returnValue(Promise.resolve(['u2']));

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to display');
    expect(fixture.debugElement.query(By.css('#users-to-consent'))).toBe(null, 'no users loaded yet');
    expect(fixture.debugElement.query(By.css('#sent-users'))).toBe(null, 'no users loaded yet');
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(1);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(1);

    tick();//Returns
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to display');

    //Select options containing users to grant access to
    expect(fixture.debugElement.query(By.css('#users-to-consent'))).toBeDefined();
    expect(fixture.debugElement.query(By.css('#select-user-0')).nativeElement.textContent).toContain('u1');
    expect(fixture.debugElement.query(By.css('#select-user-1')).nativeElement.textContent).toContain('u3');

    //Table containing users that can access own data
    expect(fixture.debugElement.query(By.css('#sent-users'))).toBeDefined();
    expect(fixture.debugElement.query(By.css('#user-0')).nativeElement.textContent).toContain('u2');
  }));

  it('#grantDataAccess: should grant a new access', fakeAsync(()=> {
    spyOn(grantConsentService, 'getUsersToGrantDataAccessTo').and.returnValue(Promise.resolve(['u1', 'u3']));
    spyOn(grantConsentService, 'getSentUsers').and.returnValue(Promise.resolve(['u2']));
    spyOn(grantConsentService, 'grantDataAccess').and.returnValue(Promise.resolve("access granted"));

    fixture.detectChanges();
    tick();//Returns
    fixture.detectChanges();
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(1);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(1);
    fixture.debugElement.query(By.css('#select-user-1')).nativeElement.selected = true; //selects third element in select

    //grant data access to users
    comp.grantDataAccess(fixture.debugElement.query(By.css('#select-user-1')).nativeElement.value);
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('access granted');
    //no ngOnInit should be called
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(2);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(2);
  }));

  it('#deleteSentUser: should grant a new access', fakeAsync(()=> {
    spyOn(grantConsentService, 'getUsersToGrantDataAccessTo').and.returnValue(Promise.resolve(['u1', 'u3']));
    spyOn(grantConsentService, 'getSentUsers').and.returnValue(Promise.resolve(['u2']));
    spyOn(grantConsentService, 'deleteSentUser').and.returnValue(Promise.resolve("consent deleted"));

    fixture.detectChanges();
    tick();//Returns
    fixture.detectChanges();
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(1);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(1);
    fixture.debugElement.query(By.css('#select-user-1')).nativeElement.selected = true; //selects third element in select

    //grant data access to users
    comp.deleteSentUser(fixture.debugElement.query(By.css('#user-0')).nativeElement.value);
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('consent deleted');
    //no ngOnInit should be called
    expect(grantConsentService.getUsersToGrantDataAccessTo).toHaveBeenCalledTimes(2);
    expect(grantConsentService.getSentUsers).toHaveBeenCalledTimes(2);
  }));
});
