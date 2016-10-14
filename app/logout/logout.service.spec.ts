import {LogoutService} from "./logout.service";
import {Response, XHRBackend, Http, HttpModule, ResponseOptions} from "@angular/http";
import {async, TestBed, inject} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {ErrorHandler} from "../utils/errorhandler";
describe('LogoutService', ()=> {
  let service: LogoutService;
  let backend: MockBackend;
  let response: Response;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        LogoutService,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
    backend = be;
    service = new LogoutService(http);
    let options = new ResponseOptions({status: 200, body: {message: "successfully logged out user u1"}});
    response = new Response(options);
  }));

  it('#logout no user logged in, should show error message', async(()=>{
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
    service.logout().then(msg => {
        expect(msg).toEqual(ErrorHandler.USER_NOT_FOUND);
      }
    );
  }));


  it('#logout should log out user if there is one', async(()=>{
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
    localStorage.setItem('user', 'u1')
    service.logout().then(msg => {
        expect(msg).toEqual("successfully logged out user u1");
      }
    );
  }));
});
