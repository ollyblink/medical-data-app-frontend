import {ConsentDataService} from "./consentdata.service";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, XHRBackend, Http, ResponseOptions, Response} from "@angular/http";
import {TestBed, inject, async} from "@angular/core/testing";
import {ErrorHandler} from "../../utils/errorhandler";

describe("ConsentDataService", ()=> {
  let service: ConsentDataService;
  let backend: MockBackend

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ConsentDataService,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend)=> {
    backend = be;
    service = new ConsentDataService(http);
  }));

  afterEach(()=> {
    localStorage.removeItem('user');

  });

  it('#getOtherData', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {user: "u2", spirometryData: [{title: "test", dateTime: "2000", fvc: 1, fev1: 1}]}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));

    //Without defined user
    service.getOtherData('u2').then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');

    service.getOtherData('u2').then(json => {
      expect(json.user).toBe('u2');
      expect(json.spirometryData[0].title).toBe('test');
      expect(json.spirometryData[0].dateTime).toBe('2000');
      expect(json.spirometryData[0].fvc).toBe(1);
      expect(json.spirometryData[0].fev1).toBe(1);
    });
  }));

  it('#getUsersToGrantConsentTo', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {consentedUsers: ['u1', 'u2']}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));

    //Without defined user
    service.getUsersToGrantConsentTo().then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');

    service.getUsersToGrantConsentTo().then(consentedUsers => {
      expect(consentedUsers[0]).toBe('u1');
      expect(consentedUsers[1]).toBe('u2');
    });
  }));
});
