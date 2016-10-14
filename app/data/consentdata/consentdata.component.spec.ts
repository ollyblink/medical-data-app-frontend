import {ComponentFixture, async, TestBed, fakeAsync, tick} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterStub} from "../../utils/testutils";
import {Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {ConsentDataService} from "./consentdata.service";
import {ConsentDataComponent} from "./consentdata.component";


describe('ConsentDataComponent', ()=> {
  let fixture: ComponentFixture<ConsentDataComponent>
  let comp: ConsentDataComponent;
  let consentDataService: ConsentDataService;
  let spy: any;
  let testData = {
    user: 'u1',
    spirometryData: [
      {
        title: 'test data 1', dateTime: '9-2016', fvc: 9999999999, fev1: 12345678910
      },
      {
        title: 'test data 2', dateTime: '10-2016', fvc: 1111111111, fev1: 9876543210
      }
    ]
  }

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [ConsentDataComponent],
      providers: [
        {provide: ConsentDataService},
        {provide: Router, useClass: RouterStub}
      ]
    }).compileComponents();
  }));

  beforeEach(()=> {
    localStorage.setItem('user', 'o1')
    fixture = TestBed.createComponent(ConsentDataComponent);
    comp = fixture.componentInstance;
    consentDataService = fixture.debugElement.injector.get(ConsentDataService);
  });

  afterEach(()=> {
    localStorage.removeItem('user');
  });


  /* ngOnInit example */
  it("#onInit: should not show users before OnInit", ()=> {
    spyOn(consentDataService, 'getUsersToGrantConsentTo').and.returnValue(Promise.resolve({message: 'not found'}));
    expect(fixture.debugElement.query(By.css('#choose-user'))).toBe(null, "no users pulled yet if there are any");
    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(0);
  });

  it('#onInit: should still not show users after component initialized', ()=> {
    spyOn(consentDataService, 'getUsersToGrantConsentTo').and.returnValue(Promise.resolve({message: 'not found'}));

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#choose-user'))).toBe(null, "no users pulled yet if there are any");
    expect(fixture.debugElement.query(By.css('#no-user-found')).nativeElement.textContent).toContain("No users allowed you access to their data!", "nothing loaded yet");
    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(1);
  });

  it('#getUsersToGrantConsentTo:should still not show users as none were returned', fakeAsync(()=> {
    //No data
    spyOn(consentDataService, 'getUsersToGrantConsentTo').and.returnValue(Promise.resolve([]));

    fixture.detectChanges();


    expect(fixture.debugElement.query(By.css('#choose-user'))).toBe(null, "no users pulled yet if there are any");
    expect(fixture.debugElement.query(By.css('#no-user-found')).nativeElement.textContent).toContain("No users allowed you access to their data!", "nothing loaded yet");

    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(1);

    tick(); //now should return...
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#choose-user'))).toBe(null, "no users pulled yet if there are any");
    expect(fixture.debugElement.query(By.css('#no-user-found')).nativeElement.textContent).toContain("No users allowed you access to their data!", "nothing loaded yet");

    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(1);
  }));

  it('#getUsersToGrantConsentTo:should show users after method returned', fakeAsync(()=> {
    //No data
    spyOn(consentDataService, 'getUsersToGrantConsentTo').and.returnValue(Promise.resolve(['u1', 'u2', 'u3']));

    fixture.detectChanges();


    expect(fixture.debugElement.query(By.css('#choose-user'))).toBe(null, "no users pulled yet if there are any");
    expect(fixture.debugElement.query(By.css('#no-user-found')).nativeElement.textContent).toContain("No users allowed you access to their data!", "nothing loaded yet");

    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(1);

    tick(); //now should return...
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#choose-user')).nativeElement.textContent).toContain('u1', "");
    expect(fixture.debugElement.query(By.css('#choose-user')).nativeElement.textContent).toContain('u2', "");
    expect(fixture.debugElement.query(By.css('#choose-user')).nativeElement.textContent).toContain('u3', "");
    expect(fixture.debugElement.query(By.css('#no-user-found'))).toBe(null, "should not be shown here");

    expect(consentDataService.getUsersToGrantConsentTo).toHaveBeenCalledTimes(1);
  }));
  /*ngOnInit example end*/

  it('#getOtherData: should display data of another user that this user has consent to when clicked', fakeAsync(()=> {
    spyOn(consentDataService, 'getUsersToGrantConsentTo').and.returnValue(Promise.resolve(['u1', 'u2', 'u3']));
    spyOn(consentDataService, 'getOtherData').and.returnValue(Promise.resolve({
      user: 'u3',
      spirometryData: [{title: 't1', dateTime: '2017', fvc: 11111111, fev1: 123456789}]
    }));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#user-data'))).toBe(null, 'not defined yet.');
    fixture.debugElement.query(By.css('#user-2')).nativeElement.selected = true; //selects third element in select

    comp.onChange(fixture.debugElement.query(By.css('#select-user')).nativeElement.value);
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#user-data'))).toBeDefined();
    expect(fixture.debugElement.query(By.css('#user-data')).nativeElement.textContent).toContain('t1', "");
    expect(fixture.debugElement.query(By.css('#user-data')).nativeElement.textContent).toContain('2017', "");
    expect(fixture.debugElement.query(By.css('#user-data')).nativeElement.textContent).toContain('11111111', "");
    expect(fixture.debugElement.query(By.css('#user-data')).nativeElement.textContent).toContain('123456789', "");
  }));
});
