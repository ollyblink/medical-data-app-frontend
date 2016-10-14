import {DataService} from "./data.service";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {ErrorHandler} from '../../utils/errorhandler'

import {HttpModule, XHRBackend, Http, ResponseOptions, Response} from "@angular/http";
import {TestBed, async, inject} from "@angular/core/testing";
import {Data} from "../../models/data";
describe("DataService", ()=> {
  let service: DataService;
  let backend: MockBackend;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DataService,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend)=> {
    backend = be;
    service = new DataService(http);
  }));

  afterEach(()=> {
    localStorage.removeItem('user');
  });

  it('#getOwnData', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {spirometryData: [{title: "test", dateTime: "2000", fvc: 1, fev1: 1}]}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.getOwnData().then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.getOwnData().then(data=> {
      expect(data[0].title).toBe('test');
      expect(data[0].dateTime).toBe('2000');
      expect(data[0].fvc).toBe(1);
      expect(data[0].fev1).toBe(1);
    });
  }));

  it('#deleteDataItem', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {message: "successfully deleted item"}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.deleteDataItem('item1').then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.deleteDataItem('item1').then(msg=> {
      expect(msg).toBe('successfully deleted item');
    });
  }));

  it('#addDataItem', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {message: "successfully added item"}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));

    let data = new Data('title', '2000', 1, 1);
    //Without defined user
    service.addDataItem(data).then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.addDataItem(data).then(msg => {
      expect(msg).toBe("successfully added item");
    });

  }));
});
