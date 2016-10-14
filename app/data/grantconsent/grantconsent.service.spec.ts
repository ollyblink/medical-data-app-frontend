import {MockBackend, MockConnection} from "@angular/http/testing";
import {ErrorHandler} from '../../utils/errorhandler'

import {HttpModule, XHRBackend, Http, ResponseOptions, Response} from "@angular/http";
import {TestBed, async, inject} from "@angular/core/testing";
import {GrantConsentService} from "./grantconsent.service";

describe("GrantConsentService", ()=> {
  let service: GrantConsentService;
  let backend: MockBackend;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        GrantConsentService,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend)=> {
    backend = be;
    service = new GrantConsentService(http);
  }));

  afterEach(()=> {
    localStorage.removeItem('user');
  });

  it('#grantDataAccess', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {message: 'granted data access to user'}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.grantDataAccess('u1').then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.grantDataAccess('u1').then(msg=> {
      expect(msg).toBe('granted data access to user');
    });
  }));

  it('#getUsersToGrantDataAccessTo', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {authorisableUsers: ['u1', 'u2']}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.getUsersToGrantDataAccessTo().then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.getUsersToGrantDataAccessTo().then(authorisableUsers=> {
      expect(authorisableUsers[0]).toBe('u1');
      expect(authorisableUsers[1]).toBe('u2');
    });
  }));

  it('#getSentUsers', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {consentedUsers: ['u1', 'u2']}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.getSentUsers().then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.getSentUsers().then(consentedUsers=> {
      expect(consentedUsers[0]).toBe('u1');
      expect(consentedUsers[1]).toBe('u2');
    });
  }));

  it('#deleteSentUser', async(()=> {
    let options = new ResponseOptions({
      status: 200,
      body: {message: 'deleted user'}
    });
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(options)));
    //Without defined user
    service.deleteSentUser('u1').then(msg => {
      expect(msg).toBe(ErrorHandler.USER_NOT_FOUND);
    });

    localStorage.setItem('user', 'o1');
    service.deleteSentUser('u1').then(msg=> {
      expect(msg).toBe('deleted user');
    });
  }));
});
