import {ComponentFixture, async, TestBed, fakeAsync, tick} from "@angular/core/testing";
import {DataComponent} from "./data.component";
import {DataService} from "./data.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterStub} from "../../utils/testutils";
import {Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {Data} from "../../models/data";


describe('DataComponent', ()=> {
  let fixture: ComponentFixture<DataComponent>;
  let comp: DataComponent;
  let dataService: DataService;
  let spy: any;
  let testData =
      [
        {
          title: 'test data 1', dateTime: '9-2016', fvc: 9999999999, fev1: 12345678910
        },
        {
          title: 'test data 2', dateTime: '10-2016', fvc: 1111111111, fev1: 9876543210
        }
      ]
    ;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [DataComponent],
      providers: [
        {provide: DataService},
        {provide: Router, useClass: RouterStub}
      ]
    }).compileComponents();
  }));

  beforeEach(()=> {
    localStorage.setItem('user', 'o1')
    fixture = TestBed.createComponent(DataComponent);
    comp = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
  });

  afterEach(()=> {
    localStorage.removeItem('user');
  });

  /* ngOnInit example */
  it("#onInit: should not show data before OnInit", ()=> {
    spy = spyOn(dataService, 'getOwnData').and.returnValue(Promise.resolve(testData));
    expect(fixture.debugElement.query(By.css('.data'))).toBe(null, 'nothing to display');
    expect(spy.calls.any()).toBe(false, 'getOwnData not yet called');
  });

  it('#onInit: should still not show data after component initialized', ()=> {
    spy = spyOn(dataService, 'getOwnData').and.returnValue(Promise.resolve(testData));
    //Async call --> should not return yet.
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.data'))).toBe(null, 'nothing to display');
    expect(spy.calls.any()).toBe(true, 'getOwnData called, but not returned yet');
  });

  it('#getOwnData: should show own data after onInit call to getOwnData', fakeAsync(()=> {
    spy = spyOn(dataService, 'getOwnData').and.returnValue(Promise.resolve(testData));
    expect(dataService.getOwnData).toHaveBeenCalledTimes(0);
    fixture.detectChanges();
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
    tick();
    fixture.detectChanges();
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[0].title, 'should contain data set 1 title');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[0].dateTime, 'should contain data 1 set dateTime');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[0].fev1, 'should contain data set 1 fev1');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[0].fvc, 'should contain data set 1 fvc');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[1].title, 'should contain data set 2 title');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[1].dateTime, 'should contain data set 2 dateTime');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[1].fev1, 'should contain data set 2 fev1');
    expect(fixture.debugElement.query(By.css('.data')).nativeElement.textContent).toContain(testData[1].fvc, 'should contain data set 2 fvc');

    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
  }));
  /*ngOnInit example end*/

  it('#deleteDataItem: should delete data item with title "test data 2"', fakeAsync(()=> {
    let testMessage = 'deleted item with title ' + testData[1].title;
    spyOn(dataService, 'getOwnData').and.returnValue(Promise.resolve(testData));
    spyOn(dataService, 'deleteDataItem').and.returnValue(Promise.resolve(testMessage));

    expect(dataService.getOwnData).toHaveBeenCalledTimes(0);
    fixture.detectChanges();
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
    tick();
    fixture.detectChanges();
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
    expect(dataService.deleteDataItem).toHaveBeenCalledTimes(0);

    //delete an item by clicking the link
    fixture.debugElement.query(By.css('#deleteItem-1')).nativeElement.click();
    fixture.detectChanges();

    //Invoked, but not yet returned
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain('test data 2', 'message should be title of item to delete');

    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent).toContain(testMessage, 'message should be message returned from server');
    expect(dataService.getOwnData).toHaveBeenCalledTimes(2); // because it updates it again in deleteDataItem
    expect(dataService.deleteDataItem).toHaveBeenCalledTimes(1);
  }));

  it('#showAddItem: should toggle the add item', ()=> {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#showAddItem')).nativeElement.textContent.trim()).toContain('Add new data item', 'shown');
    expect(fixture.debugElement.query(By.css('#hideAddItem'))).toBe(null, 'not shown yet')
    fixture.debugElement.query(By.css('#showAddItem')).nativeElement.click(); // removes showAddItem and adds hideAddItem
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#showAddItem'))).toBe(null, 'not shown anymore');
    expect(fixture.debugElement.query(By.css('#hideAddItem')).nativeElement.textContent.trim()).toBe("Hide", 'shown')
    fixture.debugElement.query(By.css('#hideAddItem')).nativeElement.click(); // removes hideAddItem and adds showAddItem
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#showAddItem')).nativeElement.textContent.trim()).toBe('Add new data item', 'shown');
    expect(fixture.debugElement.query(By.css('#hideAddItem'))).toBe(null, 'not shown anymore')
  });

  it('#addDataItem: should add a new data item', fakeAsync(()=> {
    let testMessage = "Successfully added new item";
    comp.setDataItem(new Data('title', '', 111, 222)); //Add some data to be submitted
    spyOn(dataService, 'getOwnData').and.returnValue(Promise.resolve(testData));
    spyOn(dataService, 'addDataItem').and.returnValue(Promise.resolve(testMessage));

    fixture.detectChanges();//After onInit
    fixture.debugElement.query(By.css('#showAddItem')).nativeElement.click(); //adds form elements
    fixture.detectChanges(); //After click --> form elements should be present
    expect(fixture.debugElement.query(By.css('#title'))).toBeDefined();
    expect(fixture.debugElement.query(By.css('#fvc'))).toBeDefined();
    expect(fixture.debugElement.query(By.css('#fev1'))).toBeDefined();

    tick();

    //submit data
    expect(dataService.addDataItem).toHaveBeenCalledTimes(0);
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);

    fixture.debugElement.query(By.css('#submit-button')).nativeElement.click();
    fixture.detectChanges();

    expect(dataService.addDataItem).toHaveBeenCalledTimes(1);
    expect(dataService.getOwnData).toHaveBeenCalledTimes(1);
    tick();
    fixture.detectChanges()
    expect(dataService.addDataItem).toHaveBeenCalledTimes(1);
    expect(dataService.getOwnData).toHaveBeenCalledTimes(2);
    expect(fixture.debugElement.query(By.css('#message')).nativeElement.textContent.trim()).toBe(testMessage, 'server message');
  }));
});
