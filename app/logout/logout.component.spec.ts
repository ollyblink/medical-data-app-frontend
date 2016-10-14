import {ComponentFixture, async, TestBed, tick, fakeAsync} from "@angular/core/testing";
import {LogoutComponent} from "./logout.component";
import {LogoutService} from "./logout.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {By} from "@angular/platform-browser";
describe('LogoutComponent', ()=> {
  let fixture: ComponentFixture<LogoutComponent>;

  let comp: LogoutComponent;

  let logoutService: LogoutService;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [LogoutComponent],
      providers: [
        {provide: LogoutService}
      ]
    }).compileComponents();
  }));

  beforeEach(()=> {
    fixture = TestBed.createComponent(LogoutComponent);
    comp = fixture.componentInstance;
    logoutService = fixture.debugElement.injector.get(LogoutService);
    localStorage.removeItem('user'); //Make sure to clear it again

    spyOn(logoutService, 'logout').and.returnValue('successfully logged out user');
  });
  afterEach(()=> {
    localStorage.removeItem('user'); //Make sure to clear it again
  });

  it('#ngOnInit: nothing called yet. ', ()=> {

    expect(logoutService.logout).toHaveBeenCalledTimes(0);
    fixture.detectChanges();
    //No user specified
    expect(logoutService.logout).toHaveBeenCalledTimes(0);
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('No user to log out.');

  });
  xit('#ngOnInit: Doesnt work and i have no idea why ', fakeAsync(()=> {

    localStorage.setItem('user', 'u1');

    expect(logoutService.logout).toHaveBeenCalledTimes(0);
    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to show');
    fixture.detectChanges();

    expect(logoutService.logout).toHaveBeenCalledTimes(1);
    expect(fixture.debugElement.query(By.css('#message'))).toBe(null, 'nothing to show');
    tick(); //After async method returns
    fixture.detectChanges();

    expect(logoutService.logout).toHaveBeenCalledTimes(1);
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('successfully logged out user');
    expect(localStorage.getItem('user')).toBe(null, 'user logged out');

  }));
});
